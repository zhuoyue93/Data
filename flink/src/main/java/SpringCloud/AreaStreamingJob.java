/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package SpringCloud;

import SpringCloud.data.BdPsndoc;
import org.apache.flink.api.common.functions.FlatMapFunction;
import org.apache.flink.api.common.functions.ReduceFunction;
import org.apache.flink.shaded.jackson2.com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.flink.streaming.api.datastream.DataStream;
import org.apache.flink.streaming.api.environment.StreamExecutionEnvironment;
import org.apache.flink.streaming.api.functions.sink.SinkFunction;
import org.apache.flink.streaming.api.functions.source.SourceFunction;
import org.apache.flink.streaming.api.windowing.time.Time;
import org.apache.flink.util.Collector;
import redis.clients.jedis.Jedis;

import java.io.IOException;
import java.util.Map;

public class AreaStreamingJob {

    public static void main(String[] args) throws Exception {
        final StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();
        final String DATA = "data";
        // 输入流
        DataStream<String> text = env.addSource(new SourceFunction<String>() {
            @Override
            public void run(SourceContext<String> ctx) throws Exception {
                final Jedis jedis = new Jedis("127.0.0.1", 6379);
                while (jedis.isConnected()) {
                    Map<String, String> stringStringMap = jedis.hgetAll(DATA);
                    for (String value : stringStringMap.values()) {
                        ctx.collect(value);
                    }
                }
            }

            @Override
            public void cancel() {
            }
        });
        // 配置计算MapReduce
        DataStream<WordWithCount> windowCounts = text
                .flatMap(new FlatMapFunction<String, WordWithCount>() {
                    public void flatMap(String value, Collector<WordWithCount> out) {
                        BdPsndoc bdPsndoc = null;
                        try {
                            bdPsndoc = new ObjectMapper().readValue(value, BdPsndoc.class);
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                        if (bdPsndoc != null) {
                            out.collect(new WordWithCount(bdPsndoc.getCreator(), 1L));
                        }
                    }
                })
                .keyBy("word")
                .timeWindow(Time.days(1), Time.seconds(1))
                .reduce(new ReduceFunction<WordWithCount>() {
                    public WordWithCount reduce(WordWithCount a, WordWithCount b) {
                        return new WordWithCount(a.word, a.count + b.count);
                    }
                });
        final String RESULT = "arearesult";
        windowCounts.addSink(new SinkFunction<WordWithCount>() {
            @Override
            public void invoke(WordWithCount wordWithCount) throws Exception {
                final Jedis jedis = new Jedis("127.0.0.1", 6379);
                if (wordWithCount != null && wordWithCount.word != null) {
                    jedis.hset(RESULT, wordWithCount.word, wordWithCount.count + "");
                }
            }
        }).setParallelism(1);
        env.execute("Flink Streaming Java API Skeleton");
    }

    public static class WordWithCount {

        public String word;
        public long count;

        public WordWithCount() {
        }

        public WordWithCount(String word, long count) {
            this.word = word;
            this.count = count;
        }
        @Override
        public String toString() {
            return word + " : " + count;
        }
    }
}

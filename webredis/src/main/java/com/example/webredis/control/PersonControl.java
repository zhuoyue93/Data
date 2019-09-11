package com.example.webredis.control;

import com.example.webredis.data.BdPsndoc;
import com.example.webredis.data.BdPsndocExample;
import com.example.webredis.data.BdPsndocMapper;
import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.util.JSONPObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.json.JacksonJsonParser;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
public class PersonControl {
    @Autowired
    private StringRedisTemplate redisTemplate;
    @Autowired
    private BdPsndocMapper userMapper;

    private static final String DATA="data";
    private static final String RESULT="result";
    @RequestMapping("/getUser")
    public void getUser() throws JsonProcessingException {
        List<BdPsndoc> userEntities = userMapper.selectByExample(new BdPsndocExample());
        for (BdPsndoc userEntity : userEntities) {
            redisTemplate.opsForHash().put(DATA,userEntity.getPkPsndoc(), new ObjectMapper().writeValueAsString(userEntity));
        }
    }

    @RequestMapping("/getResult")
    public Map getResult() {
        return redisTemplate.opsForHash().entries(RESULT);
    }
}

package com.example.webredis.control;

import com.example.webredis.data.BdPsndoc;
import com.example.webredis.data.BdPsndocExample;
import com.example.webredis.data.BdPsndocMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class PersonControl {
    @Autowired
    private StringRedisTemplate redisTemplate;
    @Autowired
    private BdPsndocMapper userMapper;
    @RequestMapping("/getUser")
    public void getUser() {
        List<BdPsndoc> userEntities = userMapper.selectByExample(new BdPsndocExample());
        for (BdPsndoc userEntity : userEntities) {
            redisTemplate.opsForValue().set("11",userEntity.toString());
            System.out.println(redisTemplate.opsForValue().get("11"));
        }
    }
}

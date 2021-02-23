package com.codenextbryan.musicnext;

// Following https://spring.io/guides/gs/spring-boot/

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.http.Consts;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@CrossOrigin
@RestController
public class HelloController {

    @RequestMapping("/")
    public String index() {
        return "Greetings from Spring Boot!";
    }

    @RequestMapping("/api/some-request")
    public String someRequest() throws Exception {
        CloseableHttpClient client = HttpClientBuilder.create().build();
        HttpGet request = new HttpGet("https://kepingwang.com/");
        HttpResponse response = client.execute(request);
        return EntityUtils.toString(response.getEntity()).replaceAll("\\<.*?\\>", "");
    }

    @RequestMapping("/api/spotify/{artistId}")
    public String spotify(@PathVariable(value = "artistId") String artistId) throws Exception {
        CloseableHttpClient client = HttpClientBuilder.create().build();
        ObjectMapper mapper = new ObjectMapper();
        List<NameValuePair> form = new ArrayList<>();
        form.add(new BasicNameValuePair("grant_type", "client_credentials"));
        UrlEncodedFormEntity tokenEntity = new UrlEncodedFormEntity(form, Consts.UTF_8);

        HttpPost httpPost = new HttpPost("https://accounts.spotify.com/api/token");
        httpPost.setEntity(tokenEntity);
        String encodedAuth = Base64.getEncoder().encodeToString("baa38c5b71254ff0bae35b28e10e37bc:708a4b35bd6c44d9a89bfb10bbf5779f".getBytes());
        httpPost.addHeader("Authorization", "Basic " + encodedAuth);
        HttpResponse response = client.execute(httpPost);

        JsonNode responseJson = mapper.readTree(EntityUtils.toString(response.getEntity()));
        String accessToken = responseJson.get("access_token").textValue();

        HttpGet httpGet = new HttpGet("https://api.spotify.com/v1/artists/" + artistId);
        httpGet.addHeader("Authorization", "Bearer " + accessToken);
        HttpResponse response2 = client.execute(httpGet);

        return EntityUtils.toString(response2.getEntity());
    }

    @RequestMapping("/search/{searchQuery}")
    public String search(@PathVariable(value = "searchQuery") String searchQuery) throws Exception {
        CloseableHttpClient client = HttpClientBuilder.create().build();
        ObjectMapper mapper = new ObjectMapper();
        List <NameValuePair> form = new ArrayList<>();
        form.add(new BasicNameValuePair("grant_type","client_credentials"));
        UrlEncodedFormEntity tokenEntity = new UrlEncodedFormEntity(form, Consts.UTF_8);

        HttpPost httpPost = new HttpPost("https://accounts.spotify.com/api/token");
        httpPost.setEntity(tokenEntity);
        String encodedAuth = Base64.getEncoder().encodeToString("baa38c5b71254ff0bae35b28e10e37bc:708a4b35bd6c44d9a89bfb10bbf5779f".getBytes());
        httpPost.addHeader("Authorization", "Basic " + encodedAuth);
        HttpResponse response = client.execute(httpPost);

        JsonNode responseJson = mapper.readTree(EntityUtils.toString(response.getEntity()));
        String accessToken = responseJson.get("access_token").textValue();
        searchQuery = searchQuery.replaceAll(" ","&20");
        HttpGet httpGet = new HttpGet("https://api.spotify.com/v1/search?q=" + searchQuery + "&type=track");
        httpGet.addHeader("Authorization", "Bearer " + accessToken);
        HttpResponse response2 = client.execute(httpGet);

        return EntityUtils.toString(response2.getEntity());
    }

    @RequestMapping("/userLogin/{info}")
    public String user(@PathVariable(value = "info") String info) throws Exception {
        CloseableHttpClient client = HttpClientBuilder.create().build();
        String clientId = Base64.getEncoder().encodeToString("baa38c5b71254ff0bae35b28e10e37bc".getBytes());
        HttpGet httpGet = new HttpGet("https://accounts.spotify.com/authorize?client_id="+clientId+ "&response_type=code&redirect_uri=youtube.com" +
                "&callback&scope=user-read-private%20user-read-email");
        HttpResponse response = client.execute(httpGet);


        return EntityUtils.toString(response.getEntity());
    }
}

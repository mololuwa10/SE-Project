package com.example.userauthentication.authentication.Controllers;

import java.net.MalformedURLException;
import java.net.URI;
import java.nio.file.Path;
import java.nio.file.Paths;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(
  origins = { "http://localhost:3000" },
  methods = {
    RequestMethod.OPTIONS,
    RequestMethod.GET,
    RequestMethod.PUT,
    RequestMethod.DELETE,
    RequestMethod.POST,
  }
)
@RestController
public class ImageController {

  @GetMapping("/uploads/{filename:.+}")
  ResponseEntity<Resource> serveFile(@PathVariable String filename) {
    try {
      Path file = Paths.get("uploads", filename);
      URI uri = file.toUri();
      if (uri == null) {
        throw new IllegalArgumentException("URI cannot be null");
      }
      Resource resource = new UrlResource(uri);

      if (resource.exists() || resource.isReadable()) {
        return ResponseEntity.ok().body(resource);
      } else {
        throw new RuntimeException("Could not read the file!");
      }
    } catch (MalformedURLException e) {
      throw new RuntimeException("Error: " + e.getMessage());
    }
  }
}

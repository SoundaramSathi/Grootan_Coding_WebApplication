# Grootan_Coding_WebApplication
Created for webapplication development

This project is developed to design webapplication to upload csv file of more than 1Lakh records with header values and tried to hash the password field. But, hashing the password field is having challenges in the given span of time.

Installed mongo and nodejs in local.

Launch the application by using this URL http://localhost:3000/

Then upload the csv file with required records

In windows powershell, install and start the npm server and will display the progress of the upload of data in mongo db.
npm install
npm start

once completed, application will give the complete message in UI and window powershell will display the count of the records inserted in db.

In mongo db, we can check the records inserted.

Challenges: Faced challenges in hashing the password and it is taking more time while trying to hash the password.
Add JGit Dependency: Add the JGit dependency to your pom.xml.<dependency>
    <groupId>org.eclipse.jgit</groupId>
    <artifactId>org.eclipse.jgit</artifactId>
    <version>5.13.0.202109080827-r</version>
</dependency>Clone or Open the Repository: Use JGit to open a local repository or clone a remote one.Checkout the Commit: Checkout the specific commit by its ID.Fetch the File: Read the contents of the file from the specified commit.Here’s a sample Java code snippet that demonstrates how to do this:import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.lib.ObjectId;
import org.eclipse.jgit.lib.Repository;
import org.eclipse.jgit.revwalk.RevCommit;
import org.eclipse.jgit.revwalk.RevTree;
import org.eclipse.jgit.treewalk.TreeWalk;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

public class JGitExample {

    public static void main(String[] args) {
        String repoPath = "/path/to/your/repo";  // Path to your local repository
        String commitId = "yourCommitId";        // The commit ID you want to checkout
        String filePath = "path/to/your/file";   // The file path within the repository

        try {
            // Open the repository
            Repository repository = Git.open(new File(repoPath)).getRepository();

            // Fetch the commit
            ObjectId commitObjectId = repository.resolve(commitId);
            RevCommit commit = repository.parseCommit(commitObjectId);

            // Get the tree associated with the commit
            RevTree tree = commit.getTree();

            // Use a TreeWalk to find the specific file
            try (TreeWalk treeWalk = new TreeWalk(repository)) {
                treeWalk.addTree(tree);
                treeWalk.setRecursive(true);
                treeWalk.setFilter(PathFilter.create(filePath));

                if (!treeWalk.next()) {
                    throw new IllegalStateException("Did not find expected file: " + filePath);
                }

                // Get the object ID of the file
                ObjectId objectId = treeWalk.getObjectId(0);

                // Read the file contents
                ByteArrayOutputStream out = new ByteArrayOutputStream();
                try (ObjectLoader loader = repository.open(objectId)) {
                    loader.copyTo(out);
                }

                // Output the file contents
                String fileContents = new String(out.toByteArray(), StandardCharsets.UTF_8);
                System.out.println(fileContents);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}To use a commit ID from a repository and fetch a file using JGit in a Spring Boot application, you can follow these steps:Step-by-Step GuideAdd JGit Dependency: Add JGit to your pom.xml.<dependency>
  <groupId>org.eclipse.jgit</groupId>
  <artifactId>org.eclipse.jgit</artifactId>
  <version>5.13.0.202109080827-r</version>
</dependency>Create a Service to Handle Git Operations: Create a service (GitService.java) to interact with the Git repository.import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.eclipse.jgit.lib.ObjectId;
import org.eclipse.jgit.lib.Repository;
import org.eclipse.jgit.revwalk.RevCommit;
import org.eclipse.jgit.revwalk.RevWalk;
import org.eclipse.jgit.treewalk.TreeWalk;
import org.eclipse.jgit.treewalk.filter.PathFilter;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class GitService {

  public void fetchFileFromCommit(String repoPath, String commitId, String filePath, String destinationPath) throws IOException, GitAPIException {
    try (Repository repository = Git.open(new File(repoPath)).getRepository()) {
      ObjectId commitObjectId = repository.resolve(commitId);
      try (RevWalk revWalk = new RevWalk(repository)) {
        RevCommit commit = revWalk.parseCommit(commitObjectId);

        try (TreeWalk treeWalk = new TreeWalk(repository)) {
          treeWalk.addTree(commit.getTree());
          treeWalk.setRecursive(true);
          treeWalk.setFilter(PathFilter.create(filePath));

          if (!treeWalk.next()) {
            throw new IllegalStateException("Did not find expected file: " + filePath);
          }

          ObjectId objectId = treeWalk.getObjectId(0);
          byte[] fileContent = repository.open(objectId).getBytes();

          Path destinationFilePath = Paths.get(destinationPath);
          Files.createDirectories(destinationFilePath.getParent());
          Files.write(destinationFilePath, fileContent);
        }
      }
    }
  }
}Create a Controller to Trigger the File Fetch: Create a controller (GitController.java) to provide an endpoint to trigger the file fetch.import org.eclipse.jgit.api.errors.GitAPIException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
public class GitController {

  @Autowired
  private GitService gitService;

  @GetMapping("/fetch-file")
  public String fetchFile(@RequestParam String repoPath, @RequestParam String commitId, @RequestParam String filePath, @RequestParam String destinationPath) {
    try {
      gitService.fetchFileFromCommit(repoPath, commitId, filePath, destinationPath);
      return "File fetched successfully";
    } catch (IOException | GitAPIException e) {
      e.printStackTrace();
      return "Error fetching file: " + e.getMessage();
    }
  }
}
### Spring Boot Application for Given Schema

Let's create the Spring Boot application with entities, services, controllers, and examples of input and output for each table using Postman.

#### 1. Entities

##### Page Entity

```java
import javax.persistence.*;
import java.util.Set;

@Entity
public class Page {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    @OneToOne(mappedBy = "page", cascade = CascadeType.ALL)
    private Script script;

    @OneToMany(mappedBy = "homePage", cascade = CascadeType.ALL)
    private Set<CommitDetails> commitDetails;

    // Getters and setters
}
```

##### Script Entity

```java
import javax.persistence.*;
import java.util.Set;

@Entity
public class Script {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String scriptName;
    private String gitCommitId;
    private String desc;

    @OneToOne
    @JoinColumn(name = "page_id")
    private Page page;

    @OneToMany(mappedBy = "script", cascade = CascadeType.ALL)
    private Set<ScriptDetails> scriptDetails;

    @OneToMany(mappedBy = "script", cascade = CascadeType.ALL)
    private Set<Dashboard> dashboards;

    // Getters and setters
}
```

##### CommitDetails Entity

```java
import javax.persistence.*;

@Entity
public class CommitDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String htmlName;
    private String newGitCommitId;

    @ManyToOne
    @JoinColumn(name = "home_page_id")
    private Page homePage;

    // Getters and setters
}
```

##### ScriptDetails Entity

```java
import javax.persistence.*;

@Entity
public class ScriptDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String htmlName;
    private String gitCommitId;
    private String desc;

    @ManyToOne
    @JoinColumn(name = "script_id")
    private Script script;

    // Getters and setters
}
```

##### Dashboard Entity

```java
import javax.persistence.*;

@Entity
public class Dashboard {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String oldCommitId;
    private String htmlName;
    private String newCommitId;

    @ManyToOne
    @JoinColumn(name = "script_id")
    private Script script;

    // Getters and setters
}
```

#### 2. Repositories

##### PageRepository

```java
import org.springframework.data.jpa.repository.JpaRepository;

public interface PageRepository extends JpaRepository<Page, Long> {
}
```

##### ScriptRepository

```java
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScriptRepository extends JpaRepository<Script, Long> {
}
```

##### CommitDetailsRepository

```java
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommitDetailsRepository extends JpaRepository<CommitDetails, Long> {
}
```

##### ScriptDetailsRepository

```java
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScriptDetailsRepository extends JpaRepository<ScriptDetails, Long> {
}
```

##### DashboardRepository

```java
import org.springframework.data.jpa.repository.JpaRepository;

public interface DashboardRepository extends JpaRepository<Dashboard, Long> {
}
```

#### 3. Services

##### PageService

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PageService {
    @Autowired
    private PageRepository pageRepository;

    public List<Page> findAll() {
        return pageRepository.findAll();
    }

    public Page findById(Long id) {
        return pageRepository.findById(id).orElse(null);
    }

    public Page save(Page page) {
        return pageRepository.save(page);
    }

    public void deleteById(Long id) {
        pageRepository.deleteById(id);
    }
}
```

##### ScriptService

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ScriptService {
    @Autowired
    private ScriptRepository scriptRepository;

    public List<Script> findAll() {
        return scriptRepository.findAll();
    }

    public Script findById(Long id) {
        return scriptRepository.findById(id).orElse(null);
    }

    public Script save(Script script) {
        return scriptRepository.save(script);
    }

    public void deleteById(Long id) {
        scriptRepository.deleteById(id);
    }
}
```

##### CommitDetailsService

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CommitDetailsService {
    @Autowired
    private CommitDetailsRepository commitDetailsRepository;

    public List<CommitDetails> findAll() {
        return commitDetailsRepository.findAll();
    }

    public CommitDetails findById(Long id) {
        return commitDetailsRepository.findById(id).orElse(null);
    }

    public CommitDetails save(CommitDetails commitDetails) {
        return commitDetailsRepository.save(commitDetails);
    }

    public void deleteById(Long id) {
        commitDetailsRepository.deleteById(id);
    }
}
```

##### ScriptDetailsService

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ScriptDetailsService {
    @Autowired
    private ScriptDetailsRepository scriptDetailsRepository;

    public List<ScriptDetails> findAll() {
        return scriptDetailsRepository.findAll();
    }

    public ScriptDetails findById(Long id) {
        return scriptDetailsRepository.findById(id).orElse(null);
    }

    public ScriptDetails save(ScriptDetails scriptDetails) {
        return scriptDetailsRepository.save(scriptDetails);
    }

    public void deleteById(Long id) {
        scriptDetailsRepository.deleteById(id);
    }
}
```

##### DashboardService

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DashboardService {
    @Autowired
    private DashboardRepository dashboardRepository;

    public List<Dashboard> findAll() {
        return dashboardRepository.findAll();
    }

    public Dashboard findById(Long id) {
        return dashboardRepository.findById(id).orElse(null);
    }

    public Dashboard save(Dashboard dashboard) {
        return dashboardRepository.save(dashboard);
    }

    public void deleteById(Long id) {
        dashboardRepository.deleteById(id);
    }
}
```

#### 4. Controllers

##### PageController

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pages")
public class PageController {
    @Autowired
    private PageService pageService;

    @GetMapping
    public List<Page> findAll() {
        return pageService.findAll();
    }

    @GetMapping("/{id}")
    public Page findById(@PathVariable Long id) {
        return pageService.findById(id);
    }

    @PostMapping
    public Page save(@RequestBody Page page) {
        return pageService.save(page);
    }

    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable Long id) {
        pageService.deleteById(id);
    }
}
```

##### ScriptController

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/scripts")
public class ScriptController {
    @Autowired
    private ScriptService scriptService;

    @GetMapping
    public List<Script> findAll() {
        return scriptService.findAll();
    }

    @GetMapping("/{id}")
    public Script findById(@PathVariable Long id) {
        return scriptService.findById(id);
    }

    @PostMapping
    public Script save(@RequestBody Script script) {
        return scriptService.save(script);
    }

    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable Long id) {
        scriptService.deleteById(id);
    }
}
```

##### CommitDetailsController

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/commitdetails")
public class CommitDetailsController {
    @Autowired
    private CommitDetailsService commitDetailsService;

    @GetMapping
    public List<CommitDetails> findAll() {
        return commitDetailsService.findAll();
    }

    @GetMapping("/{id}")
    public CommitDetails findById(@PathVariable Long id) {
        return commitDetailsService.findById(id);
    }

    @PostMapping
    public CommitDetails save(@RequestBody CommitDetails commitDetails) {
        return commitDetailsService.save(commitDetails);
    }

    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable Long id) {
        commitDetailsService.deleteById(id);
    }
}
```

##### ScriptDetailsController

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/scriptdetails")
public class ScriptDetailsController {
    @Autowired
    private ScriptDetailsService scriptDetailsService;

    @GetMapping
    public List<ScriptDetails> findAll() {
        return scriptDetailsService.findAll();
    }

    @GetMapping("/{id}")
    public ScriptDetails findById(@PathVariable Long id) {
        return scriptDetailsService.findById(id);
    }

    @PostMapping
    public ScriptDetails save(@RequestBody ScriptDetails scriptDetails) {
        return scriptDetails
### Controllers (continued)

##### ScriptDetailsController (continued)

```java
        return scriptDetailsService.save(scriptDetails);
    }

    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable Long id) {
        scriptDetailsService.deleteById(id);
    }
}
```

##### DashboardController

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {
    @Autowired
    private DashboardService dashboardService;

    @GetMapping
    public List<Dashboard> findAll() {
        return dashboardService.findAll();
    }

    @GetMapping("/{id}")
    public Dashboard findById(@PathVariable Long id) {
        return dashboardService.findById(id);
    }

    @PostMapping
    public Dashboard save(@RequestBody Dashboard dashboard) {
        return dashboardService.save(dashboard);
    }

    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable Long id) {
        dashboardService.deleteById(id);
    }
}
```

### Input and Output in Postman

#### Creating a Page

- **URL:** `http://localhost:8080/pages`
- **Method:** POST
- **Request Body:**

  ```json
  {
      "name": "HomePage"
  }
  ```

- **Response Body:**

  ```json
  {
      "id": 1,
      "name": "HomePage",
      "script": null,
      "commitDetails": []
  }
  ```

#### Creating a Script

- **URL:** `http://localhost:8080/scripts`
- **Method:** POST
- **Request Body:**

  ```json
  {
      "scriptName": "Script1",
      "gitCommitId": "commit123",
      "desc": "Script for HomePage",
      "page": {
          "id": 1
      }
  }
  ```

- **Response Body:**

  ```json
  {
      "id": 1,
      "scriptName": "Script1",
      "gitCommitId": "commit123",
      "desc": "Script for HomePage",
      "page": {
          "id": 1,
          "name": "HomePage"
      },
      "scriptDetails": [],
      "dashboards": []
  }
  ```

#### Creating a CommitDetail

- **URL:** `http://localhost:8080/commitdetails`
- **Method:** POST
- **Request Body:**

  ```json
  {
      "htmlName": "index.html",
      "newGitCommitId": "commit123",
      "homePage": {
          "id": 1
      }
  }
  ```

- **Response Body:**

  ```json
  {
      "id": 1,
      "htmlName": "index.html",
      "newGitCommitId": "commit123",
      "homePage": {
          "id": 1,
          "name": "HomePage"
      }
  }
  ```

#### Creating a ScriptDetail

- **URL:** `http://localhost:8080/scriptdetails`
- **Method:** POST
- **Request Body:**

  ```json
  {
      "htmlName": "index.html",
      "gitCommitId": "commit123",
      "desc": "Initial commit",
      "script": {
          "id": 1
      }
  }
  ```

- **Response Body:**

  ```json
  {
      "id": 1,
      "htmlName": "index.html",
      "gitCommitId": "commit123",
      "desc": "Initial commit",
      "script": {
          "id": 1,
          "scriptName": "Script1"
      }
  }
  ```

#### Creating a Dashboard Entry

- **URL:** `http://localhost:8080/dashboard`
- **Method:** POST
- **Request Body:**

  ```json
  {
      "oldCommitId": "commit122",
      "htmlName": "index.html",
      "newCommitId": "commit123",
      "script": {
          "id": 1
      }
  }
  ```

- **Response Body:**

  ```json
  {
      "id": 1,
      "oldCommitId": "commit122",
      "htmlName": "index.html",
      "newCommitId": "commit123",
      "script": {
          "id": 1,
          "scriptName": "Script1"
      }
  }
  ```

### Summary

This setup provides a complete Spring Boot application with five relational tables (`pages`, `script`, `commitdetails`, `scriptdetails`, and `dashboard`) and implements the corresponding entities, repositories, services, and controllers. The provided examples show how to create entries in these tables using Postman.

You can use the provided controllers to perform CRUD operations on each entity, and the services and repositories ensure that these operations are properly handled. The `OneToOne` and `OneToMany` relationships are established in the entities, ensuring the correct relational mapping in your database.

Feel free to customize the entities, services, and controllers further according to your business logic and requirements.
Certainly! Below is the complete Spring Boot code to fetch a file from a Git repository and display its contents in the console using the commit ID. This example uses the JGit library to interact with the Git repository.

### Directory Structure

Ensure your project structure looks like this:

```
src/
└── main/
    ├── java/
    │   └── com/
    │       └── example/
    │           ├── GitFetchApplication.java
    │           ├── controller/
    │           │   └── GitController.java
    │           ├── service/
    │           │   ├── GitService.java
    │           │   └── IGitService.java
    └── resources/
        └── application.properties
```

### GitFetchApplication.java

This is your main Spring Boot application class.

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class GitFetchApplication {

    public static void main(String[] args) {
        SpringApplication.run(GitFetchApplication.class, args);
    }
}
```

### IGitService.java

This is the service interface.

```java
import org.eclipse.jgit.api.errors.GitAPIException;

import java.io.IOException;

public interface IGitService {
    String fetchFileFromCommit(String repoPath, String commitId, String filePath) throws IOException, GitAPIException;
}
```

### GitService.java

This is the service implementation that handles the logic for fetching files from the Git repository.

```java
import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.eclipse.jgit.revwalk.RevCommit;
import org.eclipse.jgit.revwalk.RevWalk;
import org.eclipse.jgit.treewalk.TreeWalk;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

@Service
public class GitService implements IGitService {

    @Override
    public String fetchFileFromCommit(String repoPath, String commitId, String filePath) throws IOException, GitAPIException {
        File localRepoDir = Files.createTempDirectory("tempRepo").toFile();
        String fileContents = "";

        try (Git git = repoPath.startsWith("http") || repoPath.startsWith("git@") ?
                Git.cloneRepository().setURI(repoPath).setDirectory(localRepoDir).call() :
                Git.open(new File(repoPath))) {

            RevWalk walk = new RevWalk(git.getRepository());
            RevCommit commit = walk.parseCommit(git.getRepository().resolve(commitId));

            try (TreeWalk treeWalk = TreeWalk.forPath(git.getRepository(), filePath, commit.getTree())) {
                if (treeWalk == null) {
                    throw new IOException("File not found in the specified commit");
                }

                try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
                    treeWalk.getObjectReader().copyTo(out, treeWalk.getObjectId(0));
                    fileContents = new String(out.toByteArray(), "UTF-8");
                }
            }
        } finally {
            if (localRepoDir.exists()) {
                deleteDirectory(localRepoDir);
            }
        }

        return fileContents;
    }

    private void deleteDirectory(File directory) throws IOException {
        if (directory.isDirectory()) {
            File[] files = directory.listFiles();
            if (files != null) {
                for (File file : files) {
                    deleteDirectory(file);
                }
            }
        }
        Files.delete(directory.toPath());
    }
}
```

### GitController.java

This is the controller that maps the endpoint for fetching the file.

```java
import org.eclipse.jgit.api.errors.GitAPIException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/git")
public class GitController {

    @Autowired
    private IGitService gitService;

    @GetMapping("/fetch-file")
    public ResponseEntity<String> fetchFile(@RequestParam String repoPath,
                                            @RequestParam String commitId,
                                            @RequestParam String filePath) {
        try {
            String fileContents = gitService.fetchFileFromCommit(repoPath, commitId, filePath);
            System.out.println(fileContents);
            return ResponseEntity.ok(fileContents);
        } catch (IOException | GitAPIException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Error fetching file: " + e.getMessage());
        }
    }
}
```

### application.properties

Ensure your `application.properties` file includes the necessary configurations:

```properties
server.port=8080
```

### Testing with Postman

1. **Open Postman:**
   Open the Postman application.

2. **Create a New Request:**
   Click on the "New" button and select "Request".

3. **Set the HTTP Method to GET:**
   In the request builder, set the HTTP method to GET.

4. **Set the URL:**
   Enter the URL for your endpoint:
   ```
   http://localhost:8080/git/fetch-file
   ```

5. **Add Query Parameters:**
   In the Params tab, add the following query parameters:

   | Key         | Value                                             |
   |-------------|---------------------------------------------------|
   | repoPath    | `/path/to/local/repo` or `https://github.com/user/repo.git` |
   | commitId    | `abcdef123456`                                    |
   | filePath    | `src/main/java/com/example/MyFile.java`           |

6. **Send the Request:**
   Click on the "Send" button to send the request.

### Example Usage

Assume you want to fetch a file from a GitHub repository:

```
http://localhost:8080/git/fetch-file?repoPath=https://github.com/n320ajay/Cognizant-&commitId=abcdef123456&filePath=src/main/java/com/example/MyFile.java
```

By following these steps, the Spring Boot application will fetch the specified file from the Git repository at the given commit and print its contents to the console. If there are any issues, please provide the error details for further assistance.



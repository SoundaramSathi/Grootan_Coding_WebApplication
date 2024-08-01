77⁶y6# Grootan_Coding_WebApplication
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

It looks like there's an issue with the use of the `ObjectReader` in the `GitService` code. The `ObjectReader` class in JGit does not have a method named `copyTo(ByteArrayOutputStream, ObjectId)`.

To correct this, you need to use `ObjectReader.open` and `ObjectLoader` to read the contents of the file. Here’s the updated `GitService` implementation:

### Updated GitService.java

```java
import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.eclipse.jgit.lib.ObjectId;
import org.eclipse.jgit.lib.ObjectLoader;
import org.eclipse.jgit.revwalk.RevCommit;
import org.eclipse.jgit.revwalk.RevWalk;
import org.eclipse.jgit.treewalk.TreeWalk;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;

@Service
public class GitService implements IGitService {

    @Override
    public String fetchFileFromCommit(String repoPath, String commitId, String filePath) throws IOException, GitAPIException {
        File localRepoDir = Files.createTempDirectory("tempRepo").toFile();
        String fileContents = "";

        try (Git git = Git.cloneRepository().setURI(repoPath).setDirectory(localRepoDir).call()) {

            RevWalk walk = new RevWalk(git.getRepository());
            RevCommit commit = walk.parseCommit(git.getRepository().resolve(commitId));

            try (TreeWalk treeWalk = TreeWalk.forPath(git.getRepository(), filePath, commit.getTree())) {
                if (treeWalk == null) {
                    throw new IOException("File not found in the specified commit");
                }

                ObjectId objectId = treeWalk.getObjectId(0);
                ObjectLoader loader = git.getRepository().open(objectId);

                try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
                    loader.copyTo(out);
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

### Explanation

- **`ObjectId objectId = treeWalk.getObjectId(0);`**: Retrieves the object ID for the file from the tree walk.
- **`ObjectLoader loader = git.getRepository().open(objectId);`**: Opens the object loader for the specified object ID.
- **`loader.copyTo(out);`**: Reads the contents of the file into the `ByteArrayOutputStream`.

### Testing with Postman

You can test this implementation with Postman as described before:

1. **
To fetch a file from a Git repository using a commit ID and display its contents in a Spring Boot application, you can use the JGit library. JGit is a Java library for working with Git repositories. Below is a step-by-step guide with sample code to achieve this.

1. **Add JGit Dependency**: First, add the JGit dependency to your `pom.xml` file if you're using Maven:

    ```xml
    <dependency>
        <groupId>org.eclipse.jgit</groupId>
        <artifactId>org.eclipse.jgit</artifactId>
        <version>6.3.0.202306190621-r</version>
    </dependency>
    ```

2. **Fetch File from Git Repository**: Use the following Spring Boot service to fetch a file from a Git repository based on a commit ID and print its contents to the console.

    ```java
    package com.example.demo.service;

    import org.eclipse.jgit.api.Git;
    import org.eclipse.jgit.api.errors.GitAPIException;
    import org.eclipse.jgit.lib.ObjectId;
    import org.eclipse.jgit.revwalk.RevCommit;
    import org.eclipse.jgit.treewalk.TreeWalk;
    import org.springframework.stereotype.Service;

    import java.io.IOException;
    import java.io.InputStream;
    import java.nio.charset.StandardCharsets;
    import java.util.Scanner;

    @Service
    public class GitService {

        private static final String REPO_PATH = "/path/to/your/repo"; // Replace with the path to your local repo

        public void printFileContents(String commitId, String filePath) {
            try (Git git = Git.open(new java.io.File(REPO_PATH))) {
                ObjectId commitIdObj = git.getRepository().resolve(commitId);
                RevCommit commit = git.log().add(commitIdObj).call().iterator().next();

                try (TreeWalk treeWalk = new TreeWalk(git.getRepository())) {
                    treeWalk.addTree(commit.getTree());
                    treeWalk.setRecursive(true);

                    while (treeWalk.next()) {
                        if (treeWalk.getPathString().equals(filePath)) {
                            try (InputStream stream = git.getRepository().open(treeWalk.getObjectId(0)).getInputStream()) {
                                Scanner scanner = new Scanner(stream, StandardCharsets.UTF_8.name());
                                while (scanner.hasNextLine()) {
                                    System.out.println(scanner.nextLine());
                                }
                            }
                            break;
                        }
                    }
                }
            } catch (IOException | GitAPIException e) {
                e.printStackTrace();
            }
        }
    }
    ```

3. **Usage in a Controller**: You can use this service in a Spring Boot controller to expose an endpoint or use it directly in your application logic.

    ```java
    package com.example.demo.controller;

    import com.example.demo.service.GitService;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.web.bind.annotation.GetMapping;
    import org.springframework.web.bind.annotation.RequestParam;
    import org.springframework.web.bind.annotation.RestController;

    @RestController
    public class GitController {

        @Autowired
        private GitService gitService;

        @GetMapping("/fetch-file")
        public void fetchFile(@RequestParam String commitId, @RequestParam String filePath) {
            gitService.printFileContents(commitId, filePath);
        }
    }
    ```

4. **Run Your Application**: Start your Spring Boot application and navigate to `/fetch-file?commitId=<your_commit_id>&filePath=<your_file_path>` to fetch and print the file contents.

Make sure you replace `/path/to/your/repo` with the actual path to your local Git repository and adjust the commit ID and file path parameters as needed.
It looks like you're encountering an issue with the `getInputStream()` method on an `ObjectLoader`. In JGit, `ObjectLoader` is an abstract class, and the method to retrieve the content of the object depends on the specific type of the object. 

Here's a revised approach to fetch and read file contents from a Git repository using JGit:

### Updated Approach

1. **Add JGit Dependency**: Ensure you have the JGit dependency in your `pom.xml`.

2. **Fetch File from Git Repository**: Update the `printFileContents` method to use `ObjectLoader` correctly.

Here's the revised code:

```java
package com.example.demo.service;

import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.eclipse.jgit.lib.ObjectId;
import org.eclipse.jgit.lib.Repository;
import org.eclipse.jgit.objects.ObjectLoader;
import org.eclipse.jgit.revwalk.RevCommit;
import org.eclipse.jgit.treewalk.TreeWalk;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Scanner;

@Service
public class GitService {

    private static final String REPO_PATH = "/path/to/your/repo"; // Replace with the path to your local repo

    public void printFileContents(String commitId, String filePath) {
        try (Git git = Git.open(new java.io.File(REPO_PATH));
             Repository repository = git.getRepository()) {

            ObjectId commitIdObj = repository.resolve(commitId);
            RevCommit commit = git.log().add(commitIdObj).call().iterator().next();

            try (TreeWalk treeWalk = new TreeWalk(repository)) {
                treeWalk.addTree(commit.getTree());
                treeWalk.setRecursive(true);

                while (treeWalk.next()) {
                    if (treeWalk.getPathString().equals(filePath)) {
                        ObjectId objectId = treeWalk.getObjectId(0);
                        ObjectLoader loader = repository.open(objectId);
                        try (InputStream stream = new ByteArrayInputStream(loader.getBytes())) {
                            Scanner scanner = new Scanner(stream, StandardCharsets.UTF_8.name());
                            while (scanner.hasNextLine()) {
                                System.out.println(scanner.nextLine());
                            }
                        }
                        break;
                    }
                }
            }
        } catch (IOException | GitAPIException e) {
            e.printStackTrace();
        }
    }
}
```

### Explanation

- **ObjectLoader**: Use `loader.getBytes()` to get the byte array of the file content.
- **ByteArrayInputStream**: Create an `InputStream` from the byte array to read the file content.

### Running the Application

Follow the same steps as before with Postman:

- Start your Spring Boot application.
- Use Postman to make a `GET` request to `/fetch-file` with `commitId` and `filePath` as query parameters.

This approach should correctly fetch and display the file contents.
To fetch a file from a remote Git repository using a commit ID and display its contents in the console using Spring Boot, you need to:

1. Clone the repository.
2. Check out the specific commit.
3. Retrieve the file from that commit.
4. Print the file contents to the console.

Here's a complete Spring Boot example to achieve this:

### 1. **Add JGit Dependency**

Ensure your `pom.xml` includes the JGit dependency:

```xml
<dependency>
    <groupId>org.eclipse.jgit</groupId>
    <artifactId>org.eclipse.jgit</artifactId>
    <version>6.3.0.202306190621-r</version>
</dependency>
```

### 2. **Create the Git Service**

Create a service class that handles the interaction with the remote Git repository:

```java
package com.example.demo.service;

import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.eclipse.jgit.lib.ObjectId;
import org.eclipse.jgit.lib.Repository;
import org.eclipse.jgit.objects.ObjectLoader;
import org.eclipse.jgit.revwalk.RevCommit;
import org.eclipse.jgit.treewalk.TreeWalk;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Scanner;

@Service
public class GitService {

    private static final String REMOTE_REPO_URL = "https://github.com/yourusername/yourrepository.git"; // Replace with your remote repo URL
    private static final String REMOTE_USERNAME = "your-username"; // Replace with your username
    private static final String REMOTE_PASSWORD = "your-password"; // Replace with your password or token

    public void printFileContents(String commitId, String filePath) {
        try (Git git = Git.cloneRepository()
                .setURI(REMOTE_REPO_URL)
                .setCredentialsProvider(new UsernamePasswordCredentialsProvider(REMOTE_USERNAME, REMOTE_PASSWORD))
                .setDirectory(new java.io.File("/tmp/temporary-repo")) // Temporary directory
                .call();
             Repository repository = git.getRepository()) {

            ObjectId commitIdObj = repository.resolve(commitId);
            RevCommit commit = git.log().add(commitIdObj).call().iterator().next();

            try (TreeWalk treeWalk = new TreeWalk(repository)) {
                treeWalk.addTree(commit.getTree());
                treeWalk.setRecursive(true);

                while (treeWalk.next()) {
                    if (treeWalk.getPathString().equals(filePath)) {
                        ObjectId objectId = treeWalk.getObjectId(0);
                        ObjectLoader loader = repository.open(objectId);
                        try (InputStream stream = new ByteArrayInputStream(loader.getBytes())) {
                            Scanner scanner = new Scanner(stream, StandardCharsets.UTF_8.name());
                            while (scanner.hasNextLine()) {
                                System.out.println(scanner.nextLine());
                            }
                        }
                        break;
                    }
                }
            }
        } catch (IOException | GitAPIException e) {
            e.printStackTrace();
        } finally {
            // Clean up the temporary directory
            deleteDirectory(new java.io.File("/tmp/temporary-repo"));
        }
    }

    private void deleteDirectory(java.io.File directory) throws IOException {
        if (directory.isDirectory()) {
            java.io.File[] files = directory.listFiles();
            if (files != null) {
                for (java.io.File file : files) {
                    deleteDirectory(file);
                }
            }
        }
        directory.delete();
    }
}
```

### 3. **Create the Controller**

Create a controller to expose an endpoint for fetching the file contents:

```java
package com.example.demo.controller;

import com.example.demo.service.GitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class GitController {

    @Autowired
    private GitService gitService;

    @GetMapping("/fetch-file")
    public void fetchFile(@RequestParam String commitId, @RequestParam String filePath) {
        gitService.printFileContents(commitId, filePath);
    }
}
```

### 4. **Run and Test**

1. **Start your Spring Boot application**.
2. **Open Postman** or your browser.
3. **Make a GET request**:
   ```
   http://localhost:8080/fetch-file?commitId=<commitId>&filePath=<filePath>
   ```
   Replace `<commitId>` and `<filePath>` with your actual commit ID and file path.

### Important Notes

- **Security**: Never hard-code sensitive information like credentials directly in the source code. Use environment variables or secure vaults in a production environment.
- **Resource Management**: Cloning and managing temporary directories should be handled carefully to avoid resource leaks.
- **Error Handling**: Ensure adequate error handling to catch issues related to repository access, file retrieval, or network problems.

This setup clones the remote repository temporarily, retrieves the file content from the specified commit, and prints it to the console.
Provide me all the possibilities to fetch a file from git remote repository using commit id using in spring boot app
To fetch a file from a remote Git repository using a commit ID in a Spring Boot application, you have several options. Here are some approaches you can consider:

1. **Using JGit Library**:
   - JGit is a Java library that provides access to Git repositories.
   - You can use JGit to clone the repository, checkout a specific commit, and then read the file.

   ```java
   import org.eclipse.jgit.api.Git;
   import org.eclipse.jgit.lib.ObjectId;
   import org.eclipse.jgit.treewalk.TreeWalk;
   import org.eclipse.jgit.treewalk.filewalk.FileTreeIterator;
   import org.eclipse.jgit.lib.Repository;
   import org.eclipse.jgit.storage.file.FileRepositoryBuilder;

   import java.io.File;
   import java.io.IOException;
   import java.io.InputStream;
   import java.nio.file.Files;
   import java.nio.file.Paths;

   public class GitFileFetcher {
       public static void main(String[] args) throws Exception {
           String repoUrl = "https://github.com/your/repo.git";
           String commitId = "your_commit_id";
           String filePath = "path/to/your/file.txt";

           try (Git git = Git.cloneRepository()
                   .setURI(repoUrl)
                   .setDirectory(new File("repo"))
                   .call()) {
               Repository repo = git.getRepository();
               ObjectId commit = repo.resolve(commitId);
               try (TreeWalk treeWalk = new TreeWalk(repo)) {
                   treeWalk.addTree(repo.parseCommit(commit).getTree());
                   treeWalk.setRecursive(true);
                   while (treeWalk.next()) {
                       if (treeWalk.getPathString().equals(filePath)) {
                           try (InputStream in = repo.open(treeWalk.getObjectId(0)).openStream()) {
                               Files.copy(in, Paths.get("local-file.txt"));
                           }
                       }
                   }
               }
           }
       }
   }
   ```

2. **Using Command Line Git Commands**:
   - Execute Git commands via Java's `Runtime.exec()` or `ProcessBuilder` to fetch the file.
   
   ```java
   import java.io.BufferedReader;
   import java.io.InputStreamReader;
   import java.io.IOException;

   public class GitFileFetcher {
       public static void main(String[] args) {
           String repoUrl = "https://github.com/your/repo.git";
           String commitId = "your_commit_id";
           String filePath = "path/to/your/file.txt";
           String localRepoPath = "repo";

           try {
               ProcessBuilder cloneBuilder = new ProcessBuilder("git", "clone", repoUrl, localRepoPath);
               cloneBuilder.start().waitFor();

               ProcessBuilder checkoutBuilder = new ProcessBuilder("git", "checkout", commitId);
               checkoutBuilder.directory(new File(localRepoPath));
               checkoutBuilder.start().waitFor();

               ProcessBuilder showBuilder = new ProcessBuilder("git", "show", commitId + ":" + filePath);
               showBuilder.directory(new File(localRepoPath));
               Process process = showBuilder.start();
               BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));

               String line;
               while ((line = reader.readLine()) != null) {
                   System.out.println(line);
               }
           } catch (IOException | InterruptedException e) {
               e.printStackTrace();
           }
       }
   }
   ```

3. **Using GitHub API (or other Git hosting services APIs)**:
   - If you are using GitHub or similar, you can use their APIs to fetch files from a specific commit.
   
   ```java
   import org.springframework.web.client.RestTemplate;
   import org.springframework.http.ResponseEntity;
   import java.nio.file.Files;
   import java.nio.file.Paths;
   import java.io.IOException;

   public class GitHubFileFetcher {
       public static void main(String[] args) {
           String fileUrl = "https://raw.githubusercontent.com/owner/repo/commit_id/path/to/your/file.txt";
           RestTemplate restTemplate = new RestTemplate();
           ResponseEntity<byte[]> response = restTemplate.getForEntity(fileUrl, byte[].class);

           try {
               Files.write(Paths.get("local-file.txt"), response.getBody());
           } catch (IOException e) {
               e.printStackTrace();
           }
       }
   }
   ```

4. **Using Git's Low-Level API**:
   - Access Git repository data directly through Git's low-level file system operations. This is more complex and involves interacting with Git objects directly.

Each method has its use cases depending on whether you need to interact with local repositories or remote ones, and whether you need to handle large amounts of data or just retrieve specific files.
Here are a few more advanced or alternative methods you might consider:

5. **Using a GitHub or GitLab Integration Library**:
   - For GitHub or GitLab specifically, you can use libraries like [Octokit](https://octokit.github.io/) for GitHub or [GitLab4J](https://github.com/gitlab4j/gitlab4j-api) for GitLab to fetch file contents.

   **Example using GitLab4J for GitLab:**

   ```java
   import org.gitlab4j.api.GitLabApi;
   import org.gitlab4j.api.models.RepositoryFile;
   import org.gitlab4j.api.models.RepositoryFileAccess;
   
   public class GitLabFileFetcher {
       public static void main(String[] args) {
           String privateToken = "your_private_token";
           String repositoryUrl = "https://gitlab.com/your/repo";
           String filePath = "path/to/your/file.txt";
           String branchName = "branch_name";
           GitLabApi gitLabApi = new GitLabApi(privateToken);
           
           try {
               RepositoryFile file = gitLabApi.getRepositoryFileApi().getFile(repositoryUrl, filePath, branchName);
               Files.write(Paths.get("local-file.txt"), file.getContent().getBytes());
           } catch (Exception e) {
               e.printStackTrace();
           }
       }
   }
   ```

6. **Using GitPython and a Python Integration**:
   - If you can run Python scripts, you can use [GitPython](https://gitpython.readthedocs.io/en/stable/) to interact with Git repositories and then invoke Python scripts from Java.

   **Example Python Script:**

   ```python
   from git import Repo
   import sys
   
   repo_path = 'repo'
   commit_id = 'your_commit_id'
   file_path = 'path/to/your/file.txt'
   
   repo = Repo(repo_path)
   commit = repo.commit(commit_id)
   file_content = commit.tree / file_path
   with open('local-file.txt', 'w') as f:
       f.write(file_content.data_stream.read().decode())
   ```

   **Java Integration:**

   ```java
   import java.io.BufferedReader;
   import java.io.InputStreamReader;
   
   public class PythonFileFetcher {
       public static void main(String[] args) {
           try {
               ProcessBuilder processBuilder = new ProcessBuilder("python", "fetch_file.py");
               processBuilder.redirectErrorStream(true);
               Process process = processBuilder.start();
               BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
               
               String line;
               while ((line = reader.readLine()) != null) {
                   System.out.println(line);
               }
           } catch (IOException e) {
               e.printStackTrace();
           }
       }
   }
   ```

7. **Custom HTTP Client with Git Archive Feature**:
   - Some Git servers support the `git archive` feature which allows you to download a specific tree (e.g., for a commit) as a zip file. You can fetch this zip file, unzip it, and read the file you need.

   **Example Using HttpClient:**

   ```java
   import java.io.*;
   import java.net.HttpURLConnection;
   import java.net.URL;
   
   public class GitArchiveFetcher {
       public static void main(String[] args) {
           String archiveUrl = "https://github.com/your/repo/archive/refs/heads/main.zip"; // Example URL
           String filePath = "path/to/your/file.txt";
           
           try (InputStream in = new URL(archiveUrl).openStream();
                FileOutputStream fos = new FileOutputStream("archive.zip")) {
               byte[] buffer = new byte[1024];
               int bytesRead;
               while ((bytesRead = in.read(buffer)) != -1) {
                   fos.write(buffer, 0, bytesRead);
               }
               
               // Unzip and extract the file
               // You'll need to implement unzip logic here and extract the specific file
           } catch (IOException e) {
               e.printStackTrace();
           }
       }
   }
   ```

These methods offer additional flexibility depending on your specific requirements and the environment in which your Spring Boot application is running.
Here are a few more methods to consider for fetching files from a Git repository using a commit ID in a Spring Boot application:

8. **Using GitHub GraphQL API**:
   - GitHub's GraphQL API provides a more flexible way to query for specific data, including file contents at a specific commit.

   **Example using `graphql-java` library:**

   ```java
   import graphql.GraphQL;
   import graphql.schema.GraphQLObjectType;
   import graphql.schema.GraphQLSchema;
   import graphql.schema.idl.*;
   import java.io.File;
   import java.io.FileOutputStream;
   import java.io.IOException;
   import java.io.InputStream;
   import java.net.HttpURLConnection;
   import java.net.URL;

   public class GitHubGraphQLFetcher {
       public static void main(String[] args) {
           String accessToken = "your_github_token";
           String owner = "repo_owner";
           String repoName = "repo_name";
           String commitSHA = "your_commit_sha";
           String filePath = "path/to/your/file.txt";
           
           String query = String.format(
               "query { repository(owner: \"%s\", name: \"%s\") { object(oid: \"%s\") { ... on Commit { tree { entries { name, object { ... on Blob { text } } } } } } } }",
               owner, repoName, commitSHA
           );
           
           try {
               URL url = new URL("https://api.github.com/graphql");
               HttpURLConnection conn = (HttpURLConnection) url.openConnection();
               conn.setRequestMethod("POST");
               conn.setRequestProperty("Authorization", "Bearer " + accessToken);
               conn.setRequestProperty("Content-Type", "application/json");
               conn.setDoOutput(true);
               
               String jsonBody = String.format("{\"query\": \"%s\"}", query);
               try (OutputStream os = conn.getOutputStream()) {
                   os.write(jsonBody.getBytes());
                   os.flush();
               }

               InputStream responseStream = conn.getInputStream();
               // Parse response and extract file content
               // Implementation needed to handle JSON response and save file content
           } catch (IOException e) {
               e.printStackTrace();
           }
       }
   }
   ```

9. **Using REST API for Other Git Hosting Services**:
   - If you are using other Git hosting services (e.g., Bitbucket), they often have REST APIs to fetch file contents at a specific commit.

   **Example for Bitbucket API:**

   ```java
   import org.springframework.web.client.RestTemplate;
   import org.springframework.http.ResponseEntity;
   import java.io.File;
   import java.io.FileOutputStream;
   import java.io.IOException;
   import java.nio.file.Files;
   import java.nio.file.Paths;

   public class BitbucketFileFetcher {
       public static void main(String[] args) {
           String fileUrl = "https://bitbucket.org/your/repo/raw/commit_id/path/to/your/file.txt";
           RestTemplate restTemplate = new RestTemplate();
           ResponseEntity<byte[]> response = restTemplate.getForEntity(fileUrl, byte[].class);

           try {
               Files.write(Paths.get("local-file.txt"), response.getBody());
           } catch (IOException e) {
               e.printStackTrace();
           }
       }
   }
   ```

10. **Git Over HTTP/HTTPS Using the Git Protocol**:
    - Git supports HTTP/HTTPS protocol to access repositories. You can use tools like `curl` or `wget` to fetch files from specific commits.

    **Example using `curl`:**

    ```java
    import java.io.BufferedReader;
    import java.io.InputStreamReader;
    import java.io.IOException;
    
    public class GitCurlFetcher {
        public static void main(String[] args) {
            String url = "https://github.com/your/repo/blob/commit_id/path/to/your/file.txt";
            
            try {
                ProcessBuilder processBuilder = new ProcessBuilder("curl", "-o", "local-file.txt", url);
                Process process = processBuilder.start();
                process.waitFor();
            } catch (IOException | InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
    ```

11. **Using a Git Hosting Service’s CLI Tools**:
    - Some Git hosting services provide CLI tools (e.g., GitHub CLI, GitLab CLI) that can be used to fetch files.

    **Example using GitHub CLI:**

    ```java
    import java.io.BufferedReader;
    import java.io.InputStreamReader;
    import java.io.IOException;

    public class GitHubCliFetcher {
        public static void main(String[] args) {
            String repo = "your/repo";
            String commitId = "your_commit_id";
            String filePath = "path/to/your/file.txt";
            
            try {
                ProcessBuilder processBuilder = new ProcessBuilder("gh", "repo", "download", repo, "--rev", commitId);
                Process process = processBuilder.start();
                process.waitFor();
                
                // Implement logic to extract specific file from downloaded content
            } catch (IOException | InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
    ```

These methods offer various ways to interact with Git repositories, depending on your needs and the specific Git hosting service you are using.
To modify your existing code so that it stores the file content in a folder instead of printing it, you need to update the `printFileContents` method to write the content to a file. Below is the revised code:

### `GitService.java`
```java
import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.eclipse.jgit.lib.ObjectId;
import org.eclipse.jgit.lib.ObjectLoader;
import org.eclipse.jgit.lib.Repository;
import org.eclipse.jgit.revwalk.RevCommit;
import org.eclipse.jgit.treewalk.TreeWalk;
import org.eclipse.jgit.transport.UsernamePasswordCredentialsProvider;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Scanner;

public class GitService {

    private static final String REMOTE_REPO_URL = "https://github.com/Somutech/Angular-Frontend.git"; // Replace with your repository URL
    private static final String REMOTE_USERNAME = "Somutech"; // Replace with your username
    private static final String REMOTE_PASSWORD = "S706m0u1@4556"; // Replace with your password or token

    public void storeFileContents(String commitId, String filePath, String outputDir) {
        try (Git git = Git.cloneRepository()
                .setURI(REMOTE_REPO_URL)
                .setCredentialsProvider(new UsernamePasswordCredentialsProvider(REMOTE_USERNAME, REMOTE_PASSWORD))
                .setDirectory(new File("C:\\Users\\sous\\Documents\\New folder")) // Temporary directory
                .call()) {

            Repository repository = git.getRepository();
            System.out.println("** Cloning repository... **");

            ObjectId commitIdObj = repository.resolve(commitId);

            if (commitIdObj == null) {
                System.out.println("Commit ID not found: " + commitId);
                return;
            }

            System.out.println("Commit ID found: " + commitId);

            RevCommit commit = git.log().add(commitIdObj).call().iterator().next();
            System.out.println("Commit found: " + commit.getName());

            try (TreeWalk treeWalk = new TreeWalk(repository)) {
                treeWalk.addTree(commit.getTree());
                treeWalk.setRecursive(true);

                boolean fileFound = false;

                while (treeWalk.next()) {
                    if (treeWalk.getPathString().equals(filePath)) {
                        fileFound = true;

                        ObjectId objectId = treeWalk.getObjectId(0);
                        ObjectLoader loader = repository.open(objectId);

                        try (InputStream stream = new ByteArrayInputStream(loader.getBytes());
                             FileOutputStream outputStream = new FileOutputStream(new File(outputDir, new File(filePath).getName()))) {
                            byte[] buffer = new byte[1024];
                            int length;
                            while ((length = stream.read(buffer)) != -1) {
                                outputStream.write(buffer, 0, length);
                            }
                        }

                        break;
                    }
                }

                if (!fileFound) {
                    System.out.println("File not found: " + filePath);
                }
            }

        } catch (IOException | GitAPIException e) {
            e.printStackTrace();
        } finally {
            // Clean up the temporary directory
            try {
                deleteDirectory(new File("C:\\Users\\sous\\Documents\\New folder"));
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
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
        directory.delete();
    }
}
```

### `JgitController.java`
```java
package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class JgitController {

    @Autowired
    private GitService gitService;

    @GetMapping("/fetch-file")
    public void fetchFile(@RequestParam String commitId, @RequestParam String filePath, @RequestParam String outputDir) {
        gitService.storeFileContents(commitId, filePath, outputDir);
    }
}
```

### Changes Made:
1. Renamed the class to `GitService` for consistency.
2. Changed the method `printFileContents` to `storeFileContents` to reflect its new functionality.
3. Added `outputDir` parameter to specify where to store the file.
4. Used `FileOutputStream` to write the file content to the specified directory.
5. Updated the controller to accept `outputDir` as a request parameter.

This will store the file content in the specified directory instead of printing it to the console. Make sure to replace the placeholders with your actual values and test the application thoroughly.
To fetch files based on multiple commit IDs stored in your database and store them in a specified directory without needing to clone the entire repository, you can use the `LsRemoteCommand` of JGit to list and fetch files from the remote repository directly. Here is the revised approach:

### Step 1: Update the Service

#### `GitService.java`

```java
import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.LsRemoteCommand;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.eclipse.jgit.lib.ObjectId;
import org.eclipse.jgit.lib.Repository;
import org.eclipse.jgit.revwalk.RevCommit;
import org.eclipse.jgit.transport.UsernamePasswordCredentialsProvider;
import org.eclipse.jgit.treewalk.TreeWalk;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

@Service
public class GitService {

    private static final String REMOTE_REPO_URL = "https://github.com/Somutech/Angular-Frontend.git";
    private static final String REMOTE_USERNAME = "Somutech";
    private static final String REMOTE_PASSWORD = "S706m0u1@4556";

    @Autowired
    private DashboardRepository dashboardRepository;

    public void storeFilesFromCommits(String outputDir) {
        List<Dashboard> dashboards = dashboardRepository.findAll();

        for (Dashboard dashboard : dashboards) {
            fetchAndStoreFile(dashboard.getNewCommitId(), dashboard.getHtmlName(), outputDir);
        }
    }

    private void fetchAndStoreFile(String commitId, String filePath, String outputDir) {
        try {
            LsRemoteCommand lsRemote = Git.lsRemoteRepository()
                    .setRemote(REMOTE_REPO_URL)
                    .setCredentialsProvider(new UsernamePasswordCredentialsProvider(REMOTE_USERNAME, REMOTE_PASSWORD));

            ObjectId commitIdObj = lsRemote.call().stream()
                    .filter(ref -> ref.getObjectId().getName().equals(commitId))
                    .map(ref -> ref.getObjectId())
                    .findFirst()
                    .orElse(null);

            if (commitIdObj == null) {
                System.out.println("Commit ID not found: " + commitId);
                return;
            }

            try (Git git = Git.init().call()) {
                git.fetch()
                        .setRemote(REMOTE_REPO_URL)
                        .setCredentialsProvider(new UsernamePasswordCredentialsProvider(REMOTE_USERNAME, REMOTE_PASSWORD))
                        .call();

                Repository repository = git.getRepository();
                RevCommit commit = git.log().add(commitIdObj).call().iterator().next();

                try (TreeWalk treeWalk = new TreeWalk(repository)) {
                    treeWalk.addTree(commit.getTree());
                    treeWalk.setRecursive(true);

                    boolean fileFound = false;

                    while (treeWalk.next()) {
                        if (treeWalk.getPathString().equals(filePath)) {
                            fileFound = true;

                            ObjectId objectId = treeWalk.getObjectId(0);
                            ObjectLoader loader = repository.open(objectId);

                            File outputFile = new File(outputDir, commitId + "_" + new File(filePath).getName());
                            try (InputStream stream = new ByteArrayInputStream(loader.getBytes());
                                 FileOutputStream outputStream = new FileOutputStream(outputFile)) {
                                byte[] buffer = new byte[1024];
                                int length;
                                while ((length = stream.read(buffer)) != -1) {
                                    outputStream.write(buffer, 0, length);
                                }
                            }

                            break;
                        }
                    }

                    if (!fileFound) {
                        System.out.println("File not found: " + filePath);
                    }
                }
            }
        } catch (IOException | GitAPIException e) {
            e.printStackTrace();
        }
    }
}
```

### Step 2: Update the Controller

#### `JgitController.java`

```java
package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class JgitController {

    @Autowired
    private GitService gitService;

    @GetMapping("/fetch-files")
    public void fetchFiles(@RequestParam String outputDir) {
        gitService.storeFilesFromCommits(outputDir);
    }
}
```

### Step 3: Security Configuration

Ensure the security configuration remains as previously defined to secure the endpoint.

#### `WebSecurityConfig.java`

```java
package com.example.demo;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .authorizeRequests()
                .antMatchers("/fetch-files").authenticated()
                .and()
            .httpBasic();
    }

    @Bean
    @Override
    public UserDetailsService userDetailsService() {
        UserDetails user = User.withDefaultPasswordEncoder()
            .username("user")
            .password("password")
            .roles("USER")
            .build();

        return new InMemoryUserDetailsManager(user);
    }
}
```

### Step 4: Testing with Postman

1. **Start Your Spring Boot Application**
   Ensure your Spring Boot application is running.

2. **Open Postman**
   Open Postman to create a new request.

3. **Create a GET Request**
   - **Method**: GET
   - **URL**: `http://localhost:8080/fetch-files`

4. **Add Basic Authentication**
   - Go to the "Authorization" tab.
   - Select "Basic Auth" from the Type dropdown.
   - Enter the username (`user`) and password (`password`) defined in the `WebSecurityConfig`.

5. **Add Query Parameters**
   Click on the "Params" tab and add the following parameters:
   - **Key**: `outputDir`, **Value**: `C:\\Users\\sous\\Documents\\OutputFolder`

6. **Send the Request**
   Click on the "Send" button to execute the request.

7. **Check the Output Directory**
   Verify that the files have been stored in the specified output directory, each file prefixed with its commit ID.

By following these steps, you can fetch files from a Git repository for multiple commit IDs stored in your database and store them in the specified directory without cloning the entire repository.
Sure, here's the revised code that does not require specifying a file path and fetches all files for the given commit IDs, storing them in the specified output directory:

### `GitService.java`

```java
import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.eclipse.jgit.lib.ObjectId;
import org.eclipse.jgit.lib.ObjectLoader;
import org.eclipse.jgit.lib.Repository;
import org.eclipse.jgit.revwalk.RevCommit;
import org.eclipse.jgit.transport.UsernamePasswordCredentialsProvider;
import org.eclipse.jgit.treewalk.TreeWalk;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

@Service
public class GitService {

    private static final String REMOTE_REPO_URL = "https://github.com/Somutech/Angular-Frontend.git";
    private static final String REMOTE_USERNAME = "Somutech";
    private static final String REMOTE_PASSWORD = "S706m0u1@4556";

    @Autowired
    private DashboardRepository dashboardRepository;

    public void storeFilesFromCommits(String outputDir) {
        List<Dashboard> dashboards = dashboardRepository.findAll();

        for (Dashboard dashboard : dashboards) {
            fetchAndStoreFiles(dashboard.getNewCommitId(), outputDir);
        }
    }

    private void fetchAndStoreFiles(String commitId, String outputDir) {
        try {
            // Initialize a temporary Git repository
            try (Git git = Git.init().call()) {
                git.fetch()
                        .setRemote(REMOTE_REPO_URL)
                        .setCredentialsProvider(new UsernamePasswordCredentialsProvider(REMOTE_USERNAME, REMOTE_PASSWORD))
                        .call();

                Repository repository = git.getRepository();
                ObjectId commitIdObj = repository.resolve(commitId);

                if (commitIdObj == null) {
                    System.out.println("Commit ID not found: " + commitId);
                    return;
                }

                RevCommit commit = git.log().add(commitIdObj).call().iterator().next();

                try (TreeWalk treeWalk = new TreeWalk(repository)) {
                    treeWalk.addTree(commit.getTree());
                    treeWalk.setRecursive(true);

                    while (treeWalk.next()) {
                        ObjectId objectId = treeWalk.getObjectId(0);
                        ObjectLoader loader = repository.open(objectId);

                        String filePath = treeWalk.getPathString();
                        File outputFile = new File(outputDir, commitId + "_" + filePath.replace("/", "_"));
                        outputFile.getParentFile().mkdirs(); // Ensure the directory exists

                        try (InputStream stream = new ByteArrayInputStream(loader.getBytes());
                             FileOutputStream outputStream = new FileOutputStream(outputFile)) {
                            byte[] buffer = new byte[1024];
                            int length;
                            while ((length = stream.read(buffer)) != -1) {
                                outputStream.write(buffer, 0, length);
                            }
                        }
                    }
                }
            }
        } catch (IOException | GitAPIException e) {
            e.printStackTrace();
        }
    }
}
```

### `JgitController.java`

```java
package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class JgitController {

    @Autowired
    private GitService gitService;

    @GetMapping("/fetch-files")
    public void fetchFiles(@RequestParam String outputDir) {
        gitService.storeFilesFromCommits(outputDir);
    }
}
```

### `Dashboard.java`

```java
package com.example.demo;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.JoinColumn;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
public class Dashboard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String oldCommitId;
    private String htmlName;
    private String newCommitId;

    @ManyToOne
    @JoinColumn(name="script_id")
    @JsonBackReference
    private Script script;

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOldCommitId() {
        return oldCommitId;
    }

    public void setOldCommitId(String oldCommitId) {
        this.oldCommitId = oldCommitId;
    }

    public String getHtmlName() {
        return htmlName;
    }

    public void setHtmlName(String htmlName) {
        this.htmlName = htmlName;
    }

    public String getNewCommitId() {
        return newCommitId;
    }

    public void setNewCommitId(String newCommitId) {
        this.newCommitId = newCommitId;
    }

    public Script getScript() {
        return script;
    }

    public void setScript(Script script) {
        this.script = script;
    }
}
```

### `DashboardRepository.java`

```java
package com.example.demo;

import org.springframework.data.jpa.repository.JpaRepository;

public interface DashboardRepository extends JpaRepository<Dashboard, Long> {
}
```

### Security Configuration

Ensure the security configuration remains as previously defined to secure the endpoint.

#### `WebSecurityConfig.java`

```java
package com.example.demo;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .authorizeRequests()
                .antMatchers("/fetch-files").authenticated()
                .and()
            .httpBasic();
    }

    @Bean
    @Override
    public UserDetailsService userDetailsService() {
        UserDetails user = User.withDefaultPasswordEncoder()
            .username("user")
            .password("password")
            .roles("USER")
            .build();

        return new InMemoryUserDetailsManager(user);
    }
}
```

### Testing with Postman

1. **Start Your Spring Boot Application**
   Ensure your Spring Boot application is running.

2. **Open Postman**
   Open Postman to create a new request.

3. **Create a GET Request**
   - **Method**: GET
   - **URL**: `http://localhost:8080/fetch-files`

4. **Add Basic Authentication**
   - Go to the "Authorization" tab.
   - Select "Basic Auth" from the Type dropdown.
   - Enter the username (`user`) and password (`password`) defined in the `WebSecurityConfig`.

5. **Add Query Parameters**
   Click on the "Params" tab and add the following parameter:
   - **Key**: `outputDir`, **Value**: `C:\\Users\\sous\\Documents\\OutputFolder`

6. **Send the Request**
   Click on the "Send" button to execute the request.

7. **Check the Output Directory**
   Verify that the files have been stored in the specified output directory, each file prefixed with its commit ID.

This will fetch all files for each commit ID and store them in the specified output directory without needing to specify individual file paths.
Sure, here's the revised code that does not require specifying a file path and fetches all files for the given commit IDs, storing them in the specified output directory:

### `GitService.java`

```java
import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.eclipse.jgit.lib.ObjectId;
import org.eclipse.jgit.lib.ObjectLoader;
import org.eclipse.jgit.lib.Repository;
import org.eclipse.jgit.revwalk.RevCommit;
import org.eclipse.jgit.transport.UsernamePasswordCredentialsProvider;
import org.eclipse.jgit.treewalk.TreeWalk;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

@Service
public class GitService {

    private static final String REMOTE_REPO_URL = "https://github.com/Somutech/Angular-Frontend.git";
    private static final String REMOTE_USERNAME = "Somutech";
    private static final String REMOTE_PASSWORD = "S706m0u1@4556";

    @Autowired
    private DashboardRepository dashboardRepository;

    public void storeFilesFromCommits(String outputDir) {
        List<Dashboard> dashboards = dashboardRepository.findAll();

        for (Dashboard dashboard : dashboards) {
            fetchAndStoreFiles(dashboard.getNewCommitId(), outputDir);
        }
    }

    private void fetchAndStoreFiles(String commitId, String outputDir) {
        try {
            // Initialize a temporary Git repository
            try (Git git = Git.init().call()) {
                git.fetch()
                        .setRemote(REMOTE_REPO_URL)
                        .setCredentialsProvider(new UsernamePasswordCredentialsProvider(REMOTE_USERNAME, REMOTE_PASSWORD))
                        .call();

                Repository repository = git.getRepository();
                ObjectId commitIdObj = repository.resolve(commitId);

                if (commitIdObj == null) {
                    System.out.println("Commit ID not found: " + commitId);
                    return;
                }

                RevCommit commit = git.log().add(commitIdObj).call().iterator().next();

                try (TreeWalk treeWalk = new TreeWalk(repository)) {
                    treeWalk.addTree(commit.getTree());
                    treeWalk.setRecursive(true);

                    while (treeWalk.next()) {
                        ObjectId objectId = treeWalk.getObjectId(0);
                        ObjectLoader loader = repository.open(objectId);

                        String filePath = treeWalk.getPathString();
                        File outputFile = new File(outputDir, commitId + "_" + filePath.replace("/", "_"));
                        outputFile.getParentFile().mkdirs(); // Ensure the directory exists

                        try (InputStream stream = new ByteArrayInputStream(loader.getBytes());
                             FileOutputStream outputStream = new FileOutputStream(outputFile)) {
                            byte[] buffer = new byte[1024];
                            int length;
                            while ((length = stream.read(buffer)) != -1) {
                                outputStream.write(buffer, 0, length);
                            }
                        }
                    }
                }
            }
        } catch (IOException | GitAPIException e) {
            e.printStackTrace();
        }
    }
}
```

### `JgitController.java`

```java
package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class JgitController {

    @Autowired
    private GitService gitService;

    @GetMapping("/fetch-files")
    public void fetchFiles(@RequestParam String outputDir) {
        gitService.storeFilesFromCommits(outputDir);
    }
}
```

### `Dashboard.java`

```java
package com.example.demo;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.JoinColumn;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
public class Dashboard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String oldCommitId;
    private String htmlName;
    private String newCommitId;

    @ManyToOne
    @JoinColumn(name="script_id")
    @JsonBackReference
    private Script script;

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOldCommitId() {
        return oldCommitId;
    }

    public void setOldCommitId(String oldCommitId) {
        this.oldCommitId = oldCommitId;
    }

    public String getHtmlName() {
        return htmlName;
    }

    public void setHtmlName(String htmlName) {
        this.htmlName = htmlName;
    }

    public String getNewCommitId() {
        return newCommitId;
    }

    public void setNewCommitId(String newCommitId) {
        this.newCommitId = newCommitId;
    }

    public Script getScript() {
        return script;
    }

    public void setScript(Script script) {
        this.script = script;
    }
}
```

### `DashboardRepository.java`

```java
package com.example.demo;

import org.springframework.data.jpa.repository.JpaRepository;

public interface DashboardRepository extends JpaRepository<Dashboard, Long> {
}
```

### Security Configuration

Ensure the security configuration remains as previously defined to secure the endpoint.

#### `WebSecurityConfig.java`

```java
package com.example.demo;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .authorizeRequests()
                .antMatchers("/fetch-files").authenticated()
                .and()
            .httpBasic();
    }

    @Bean
    @Override
    public UserDetailsService userDetailsService() {
        UserDetails user = User.withDefaultPasswordEncoder()
            .username("user")
            .password("password")
            .roles("USER")
            .build();

        return new InMemoryUserDetailsManager(user);
    }
}
```

### Testing with Postman

1. **Start Your Spring Boot Application**
   Ensure your Spring Boot application is running.

2. **Open Postman**
   Open Postman to create a new request.

3. **Create a GET Request**
   - **Method**: GET
   - **URL**: `http://localhost:8080/fetch-files`

4. **Add Basic Authentication**
   - Go to the "Authorization" tab.
   - Select "Basic Auth" from the Type dropdown.
   - Enter the username (`user`) and password (`password`) defined in the `WebSecurityConfig`.

5. **Add Query Parameters**
   Click on the "Params" tab and add the following parameter:
   - **Key**: `outputDir`, **Value**: `C:\\Users\\sous\\Documents\\OutputFolder`

6. **Send the Request**
   Click on the "Send" button to execute the request.

7. **Check the Output Directory**
   Verify that the files have been stored in the specified output directory, each file prefixed with its commit ID.

This will fetch all files for each commit ID and store them in the specified output directory without needing to specify individual file paths.

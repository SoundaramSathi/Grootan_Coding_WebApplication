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

based on a specific commit ID, you need to follow these steps:Add JGit Dependency: Add the JGit dependency to your pom.xml.<dependency>
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
}

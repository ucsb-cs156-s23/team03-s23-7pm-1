Bring over backend crud files for School from team02

# Acceptance Criteria:

- [ ] The `@Entity` class called School.java has been copied from the team02 repo to the team03 repo and committed.
- [ ] The `@Repository` class called `SchoolRepository.java` has been copied from the team02 repo to the team03 repo and committed.  (Note that the file should be `SchoolRepository.java`; the team02 instrutions erronously called it `School.java`; if you called it `School.java` please update the name now)
- [ ] The `@Repository` class called `SchoolRepository.java` has been copied from the team02 repo to the team03 repo and committed.  (Note that the file should be `SchoolRepository.java`; the team02 instrutions erronously called it `School.java`; if you called it `School.java` please update the name now)
- [ ] The controller file `SchoolController.java` is copied from team02 to team03
- [ ] The controller tests file `SchoolControllerTests.java` is copied from team02 to team03

- [ ] You can see the `Schools` table when you do these steps:
      1. Connect to postgres command line with 
         ```
         dokku postgres:connect team03-qa-db
         ```
      2. Enter `\dt` at the prompt. You should see
         `Schools` listed in the table.
      3. Use `\q` to quit

- [ ] The backend POST,GET,PUT,DELETE endpoints for `Restauarant` all work properly in Swagger.


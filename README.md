# Handling Named Volumes & Port Forwarding Limitations in CircleCI

CircleCI imposes two major limitations when running **Dockerized services** in `setup_remote_docker`:
1. **Named Volumes**: CircleCI does not support bind mounts (`./local-folder:/container-folder`), preventing direct file sharing between the test and a Dockerized service.
2. **Port Forwarding**: Services running inside **Docker Compose** cannot expose ports to tests running outside Docker in the CircleCI job.

Here is the exerpt from the [documentation](https://circleci.com/docs/docker-compose/#using-docker-compose-with-docker-executor)

> Using Docker Compose with Docker executor
Using the docker execution environment combined with setup_remote_docker enables you to run Docker commands similarly to how you run Docker commands in a machine execution environment. However, volume mounting and port forwarding do not work the same way when using the docker execution environment. When using the docker execution environment with setup_remote_docker, a job’s commands are executed in a container that has access to an external Docker daemon. Therefore, to use the Docker CLI or Docker Compose, you must move data around. Mounting can typically be solved by making content available in a Docker volume. It is possible to load data into a Docker volume by using docker cp to get the data from the CLI host into a location running on the Docker host.

Running tests inside a container avoids these issues but adds unnecessary complexity. Instead, a solution is to introduce a **proxy container (`test-proxy`)** that acts as a bridge between the test and the `test-server`.

## A Solution: `test-proxy`

The test runs outside Docker in CircleCI, while the `test-server` runs inside Docker. The `test-proxy` container provides:
- **Access to the shared volume** (`/app/data/data.txt`) for writing test data.
- **A proxy for fetching data** from `test-server`, since its port is not exposed.

### Why This Works
✅ **Bypasses Named Volume Limitation**: The test cannot write to a named volume directly, so `test-proxy` performs the write operation.  
✅ **Bypasses Port Forwarding Limitation**: The test cannot directly access `test-server`, so `test-proxy` forwards fetch requests internally within Docker.

### Result

![CircleCi run result](<ci.png>)
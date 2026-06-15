# Base React + Docker Project

This project is a base application built with **React**, specifically designed for **studying and practicing Docker**. The main goal is to provide a ready-to-use environment for containerizing the application, making it easier to learn how to package, distribute, and run frontend applications using containers.

## Project Purpose

- **Learn Docker:** Serve as a real, straightforward use case for learning Docker concepts such as `Dockerfile`, images, containers, and volumes.
- **Isolated Environment:** Provide a foundation to run the React application inside a container, ensuring it works exactly the same on any machine without worrying about local dependencies (solving the famous "it works on my machine" problem).
- **Practice with Docker Compose:** Use `docker-compose.yml` to orchestrate and spin up the development environment quickly and consistently.

## Technologies

- **React:** Main library for building the user interface.
- **Docker:** Platform for developing, shipping, and running the application inside containers.
- **Docker Compose:** Tool for defining and running multi-container Docker applications.

## Getting Started with Docker

To run this project using Docker, make sure you have [Docker Desktop](https://www.docker.com/products/docker-desktop/) (or the Docker Engine) installed on your system.

### 1. Build the Image and Start the Container

Since the project has a `docker-compose.yml` file, you can bring up the application with a single command. Open your terminal at the root of the project and run:

```bash
docker-compose up --build
```

- `--build`: Forces Docker to rebuild the image before starting the container (useful if you've made changes to the `Dockerfile` or dependencies).

If you only want to run it in the background (detached mode), use:

```bash
docker-compose up -d
```

### 2. Access the Application

Once the container is running, the React application should be accessible from your web browser. Depending on your configuration in `docker-compose.yml` or `Dockerfile`, you will typically be able to access it at:

`http://localhost:3000` (or the port you have exposed).

### 3. Stop the Container

To stop the containers, simply press `Ctrl + C` in the terminal where you ran the `docker-compose up` command.

If you ran it in detached mode (`-d`), use the following command to stop and remove the containers:

```bash
docker-compose down
```

## Docker-related Structure

- `/Docker/Dockerfile`: Contains the step-by-step instructions for building the Docker image for the React application (installing dependencies, building, etc.).
- `docker-compose.yml`: Configuration file that defines the application service, exposed ports, volumes (for live-reloading), and other container settings.

---

_This project is a sandbox and learning environment. Feel free to modify the Docker files and break things to learn how to fix them!_

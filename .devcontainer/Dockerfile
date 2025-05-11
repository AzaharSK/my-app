FROM node:20-bullseye

# Install basic development tools
RUN apt-get update && apt-get install -y \
    git \
    curl \
    wget \
    vim \
    less \
    procps \
    htop \
    sudo \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Set up a non-root user
ARG USERNAME=node
ARG USER_UID=1000
ARG USER_GID=$USER_UID

# Add user to sudoers
RUN echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME

# Set up NVM and install Node.js version 20
ENV NVM_DIR /home/$USERNAME/.nvm
RUN mkdir -p $NVM_DIR \
    && curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash \
    && . $NVM_DIR/nvm.sh \
    && nvm install 20 \
    && nvm use 20 \
    && nvm alias default 20

# Install global dependencies
RUN npm install -g npm@latest tsx drizzle-kit

# Switch to non-root user
USER $USERNAME

# Set the working directory
WORKDIR /workspace

# Install project dependencies
RUN npm install

# Expose necessary ports (for Express and WebSocket)
EXPOSE 5000 443

# Run the application in development mode
CMD ["npm", "run", "dev"]

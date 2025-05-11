FROM node:20-bullseye

# Install dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    wget \
    vim \
    less \
    procps \
    htop \
    sudo \
    && rm -rf /var/lib/apt/lists/*

# Set up user
ARG USERNAME=node
ARG USER_UID=1000
ARG USER_GID=$USER_UID

# Add node user to sudoers
RUN echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME

# Install PostgreSQL client
RUN apt-get update && apt-get install -y \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /workspace

# Fix permissions issue - this is the critical part
RUN mkdir -p /workspace && chown -R node:node /workspace

# Install global packages
RUN npm install -g npm@latest tsx drizzle-kit

# Switch to node user
USER $USERNAME

# Set up NVM
ENV NVM_DIR /home/$USERNAME/.nvm
RUN mkdir -p $NVM_DIR \
    && curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash \
    && . $NVM_DIR/nvm.sh

# Set shell
SHELL ["/bin/bash", "-c"]

# Copy project files and fix permissions
COPY --chown=node:node . .

# Install dependencies as node user
RUN npm install

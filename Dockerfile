FROM nikolaik/python-nodejs:python3.13-nodejs23
 
# Create the app directory
RUN mkdir /app

# Copy the Django project to the container
COPY . /app/
 
# Set the working directory inside the container
WORKDIR /app/frontend

# RUN npm install --global corepack@latest && corepack enable && \
#     corepack prepare pnpm@latest-10 --activate && pnpm config set store-dir ~/.pnpm-store \
RUN npm install && npm run build

# Change to a specific folder, within /app
WORKDIR /app/backend

# Set environment variables 
# Prevents Python from writing pyc files to disk
ENV PYTHONDONTWRITEBYTECODE=1
#Prevents Python from buffering stdout and stderr
ENV PYTHONUNBUFFERED=1 
ENV PIP_NO_CACHE_DIR=1 
 
# Upgrade pip
RUN pip install --upgrade pip 

# run this command to install all dependencies 
RUN pip install --no-cache-dir -r requirements.txt

# Expose the Django port
# EXPOSE 8000

RUN chmod +x /app/build.sh

ENTRYPOINT ["bash", "/app/build.sh"]
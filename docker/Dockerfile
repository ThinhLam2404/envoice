
# Base image
FROM node:20-alpine

# Argument for the app name
ARG APP_NAME

# Set working directory
WORKDIR /app

# Copy the built application
# Assumes 'nx build <app>' has been run mostly and 'dist/apps/<app>' exists
COPY dist/apps/${APP_NAME} .

# Install production dependencies
# The build output 'package.json' only contains dependencies used by the app
RUN npm install --omit=dev

# Expose ports (Documentary only, actual exposure via Compose)
EXPOSE 3000 3001-3010

# Helper script/command
CMD ["node", "main.js"]

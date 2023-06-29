
# Temporary builder image
FROM node:18 as builder

WORKDIR /build

# Add the project files to the image
ADD . /build

RUN npm ci

# RUN ./node_modules/grunt-cli/bin/grunt clean:release release

# RUN node_modules/grunt-cli/bin/grunt releaseIBMCloud \
#   && mv /build/dashboard/dist/release /build/dashboard/dist/release-ibmcloud


# Creates the production build (ibmcloud)
# RUN cd /build/dashboard \
#   && node_modules/grunt-cli/bin/grunt releaseIBMCloud \
#   && mv /build/dashboard/dist/release /build/dashboard/dist/release-ibmcloud

# Creates 'build.json'
# RUN TS=$(date) \
#   && cd /build/couchdb-fauxton \
#   && FAUXTON_SHA="$(cat fauxton_git_sha.txt)" \
#   && cd /build/dashboard \
#   && DASHBOARD_SHA="$(git rev-parse HEAD)" \
#   && echo '{"type":"IBMCloud", "release":"'$DASHBOARD_VERSION'", "dashboard":"'$DASHBOARD_SHA'", "fauxton":"'$FAUXTON_SHA'", "ts":"'$TS'"}' > /build/dashboard/dist/release-ibmcloud/dashboard.assets/build.json

# Copy generated files from builder image
# COPY --from=builder [ "/build/dashboard/dist/release-ibmcloud", "./dashboard-ibmcloud" ]
# COPY --from=builder /usr/src/tini /usr/src/tini

# # Nginx configuration
# ADD docker/nginx-configs .
# RUN mv nginx.conf /etc/nginx/ \
#   && mv dashboard-nginx.conf /etc/nginx/conf.d/

EXPOSE 8080

ENV COUCH_HOST=http://host.docker.internal:5984

ENTRYPOINT ["npm", "run", "dev"]

# args to use inside FROM directives
ARG PY_IMAGE
ARG PY_IMAGE_VERSION

# first stage
# by default uses alpine-based python image
FROM ${PY_IMAGE}:${PY_IMAGE_VERSION} AS requirements-cache
COPY requirements.txt .

RUN apt-get update && apt-get install -y python3-pip

# install dependencies to the local user directory (eg. /root/.local)
RUN pip install --upgrade pip
RUN pip install --user -r requirements.txt

# second release stage
FROM ${PY_IMAGE}:${PY_IMAGE_VERSION}

# arg must be inside stage in order to use it in RUN directives
ARG ALPINE_VER
ARG WB_MIRROR

# place all app releated files into /app direcotry
WORKDIR /app

# copy only the dependencies installation from the 1st stage image with new user as owner
COPY --from=requirements-cache /root/.local /root/.local
COPY . .

# update PATH environment variable
ENV PATH=/home/app/.local/bin:$PATH

CMD [ "python3", "main.py", "/data" ]


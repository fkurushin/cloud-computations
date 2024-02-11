FROM debian:11

ARG KALDI_MKL

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        wget \
        bzip2 \
        unzip \
        xz-utils \
        g++ \
        make \
        cmake \
        git \
        python3 \
        python3-dev \
        python3-websockets \
        python3-setuptools \
        python3-pip \
        python3-wheel \
        python3-cffi \
        zlib1g-dev \
        automake \
        autoconf \
        libtool \
        pkg-config \
        ca-certificates \
    && rm -rf /var/lib/apt/lists/*

RUN git clone -b vosk --single-branch https://github.com/alphacep/kaldi /opt/kaldi

WORKDIR /opt/kaldi/tools 
RUN sed -i 's:status=0:exit 0:g' extras/check_dependencies.sh
RUN sed -i 's:--enable-ngram-fsts:--enable-ngram-fsts --disable-bin:g' Makefile
RUN make -j $(nproc) openfst cub
RUN extras/install_mkl.sh

WORKDIR /opt/kaldi/src
RUN ./configure --mathlib=MKL --shared
RUN sed -i 's:-msse -msse2:-msse -msse2:g' kaldi.mk
RUN sed -i 's: -O1 : -O3 :g' kaldi.mk
RUN make -j $(nproc) online2 lm rnnlm
RUN git clone https://github.com/alphacep/vosk-api /opt/vosk-api

WORKDIR /opt/vosk-api/src
RUN KALDI_MKL=1 KALDI_ROOT=/opt/kaldi make -j $(nproc)

WORKDIR /opt/vosk-api/python
RUN python3 ./setup.py install
RUN git clone https://github.com/alphacep/vosk-server /opt/vosk-server
RUN rm -rf /opt/vosk-api/src/*.o
RUN rm -rf /opt/kaldi
RUN rm -rf /root/.cache
RUN rm -rf /var/lib/apt/lists/*



# ENV RUVERSION 0.42

# RUN mkdir /opt/vosk-model-ru \
#    && cd /opt/vosk-model-ru \
#    && wget -q http://alphacephei.com/kaldi/models/vosk-model-ru-${RUVERSION}.zip \
#    && unzip vosk-model-ru-${RUVERSION}.zip \
#    && mv vosk-model-ru-${RUVERSION} model \
#    && rm -rf model/extra \
#    && rm -rf vosk-model-ru-${RUVERSION}.zip

# EXPOSE 2700
# WORKDIR /opt/vosk-server/websocket
# CMD [ "python3", "./asr_server.py", "/opt/vosk-model-ru/model" ]


# sudo docker run -p 2700:2700 alphacep/kaldi-ru:latest
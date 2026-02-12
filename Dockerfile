FROM oven/bun:1 AS base

# Install system dependencies for converters
RUN apt-get update && apt-get install -y --no-install-recommends \
  ffmpeg \
  imagemagick \
  libreoffice \
  pandoc \
  calibre \
  inkscape \
  graphicsmagick \
  libvips-tools \
  libheif-examples \
  libjxl-tools \
  potrace \
  assimp-utils \
  texlive-xetex \
  latexmk \
  dvisvgm \
  libemail-outlook-message-perl \
  curl \
  python3-pip \
  ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Install tools not available via apt
RUN curl -L https://github.com/TomWright/dasel/releases/latest/download/dasel_linux_amd64 -o /usr/local/bin/dasel \
  && chmod +x /usr/local/bin/dasel

RUN pip install --break-system-packages markitdown

WORKDIR /app

# Install dependencies
COPY package.json bun.lock ./
COPY prisma ./prisma/
RUN bun install --frozen-lockfile

# Generate Prisma client
RUN bunx prisma generate

# Copy source
COPY src ./src/
COPY tsconfig.json ./

ENV NODE_ENV=production

CMD ["bun", "src/index.ts"]

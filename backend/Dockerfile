FROM elixir:1.16-alpine AS build

# Install build dependencies
RUN apk add --no-cache build-base git

WORKDIR /app

# Install hex and rebar
RUN mix local.hex --force && \
    mix local.rebar --force

# Copy mix files
COPY mix.exs mix.lock ./

# Install dependencies
RUN mix deps.get --only prod && \
    mix deps.compile

# Copy source code
COPY . .

# Compile application
RUN mix compile

# Build release
RUN MIX_ENV=prod mix release

# Production stage
FROM elixir:1.16-alpine

RUN apk add --no-cache openssl ncurses-libs

WORKDIR /app

# Copy release from build stage
COPY --from=build /app/_build/prod/rel/todo_list .

EXPOSE 4000

CMD ["bin/todo_list", "start"]


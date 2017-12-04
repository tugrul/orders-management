Orders Management
========================


First Preparation
--------------

```bash
composer install
yarn install
```

Create Database Schema
--------------

```bash
bin/console doctrine:schema:update --force
```

Load Sample Data
--------------

We need to sample data of __product__ and __user__ because we no needed CRUD implementation in this case study.

I created doctrine fixture to load sample data into __product__ and __user__ tables.

```bash
bin/console doctrine:fixtures:load
```

Build Assets
--------------

I used Symfony Encore because it has simple configuration to mesh *webpack*, *sass*, *bootstrap* and *react*

```bash
yarn run encore dev
```
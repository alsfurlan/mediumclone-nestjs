CREATE DATABASE mediumclone;
CREATE USER mediumclone WITH PASSWORD 'mediumclone';
GRANT ALL PRIVILEGES ON DATABASE "mediumclone" to mediumclone;
ALTER USER mediumclone WITH SUPERUSER;
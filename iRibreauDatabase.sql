-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS mydb;

-- -----------------------------------------------------
-- Table mydb.timeZone
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS mydb.timeZone (
  timeZone_id CHAR(5) NOT NULL,
  PRIMARY KEY (timeZone_id))
;


-- -----------------------------------------------------
-- Table mydb.langage
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS mydb.langage (
  language_id CHAR(5) NOT NULL,
  PRIMARY KEY (language_id))
;


-- -----------------------------------------------------
-- Table mydb.user
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS mydb.user (
  user_id INT NOT NULL,
  username VARCHAR(100) NOT NULL,
  fullName VARCHAR(100) NOT NULL,
  profilePictureUrl VARCHAR(250) NOT NULL,
  biography VARCHAR(250) NOT NULL,
  website VARCHAR(250) NOT NULL,
  mediaCounts INT NOT NULL,
  followersCount INT NOT NULL,
  followingCount INT NOT NULL,
  accessToken CHAR(40) NOT NULL,
  accessTokenSecret CHAR(40) NOT NULL,
  birthdayAt TIMESTAMP NOT NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT now(),
  deletedAt TIMESTAMP NOT NULL DEFAULT null,
  timezone_id CHAR(5) NOT NULL,
  language_id CHAR(5) NULL,
  PRIMARY KEY (user_id),
  CONSTRAINT fk_user_timeZone1
    FOREIGN KEY (timezone_id)
    REFERENCES mydb.timeZone (timeZone_id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_user_langage1
    FOREIGN KEY (language_id)
    REFERENCES mydb.langage (language_id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
;


-- -----------------------------------------------------
-- Table mydb.timeZone_has_user
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS mydb.timeZone_has_user (
  timeZone_timeZone_id CHAR(5) NOT NULL,
  user_user_id INT NOT NULL,
  user_timeZone_timeZone_id INT NOT NULL,
  PRIMARY KEY (timeZone_timeZone_id, user_user_id, user_timeZone_timeZone_id),
  CONSTRAINT fk_timeZone_has_user_timeZone1
    FOREIGN KEY (timeZone_timeZone_id)
    REFERENCES mydb.timeZone (timeZone_id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_timeZone_has_user_user1
    FOREIGN KEY (user_user_id)
    REFERENCES mydb.user (user_id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
;


-- -----------------------------------------------------
-- Table mydb.hobby
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS mydb.hobby (
  hobby_id CHAR(5) NOT NULL,
  PRIMARY KEY (hobby_id))
;


-- -----------------------------------------------------
-- Table mydb.userHobby
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS mydb.userHobby (
  hobby_id CHAR(5) NOT NULL,
  user_id INT NOT NULL,
  PRIMARY KEY (hobby_id, user_id),
  CONSTRAINT fk_userHobby_user1
    FOREIGN KEY (user_id)
    REFERENCES mydb.user (user_id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_userHobby_hobby1
    FOREIGN KEY (hobby_id)
    REFERENCES mydb.hobby (hobby_id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
;


-- -----------------------------------------------------
-- Table mydb.country
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS mydb.country (
  country_id CHAR(5) NOT NULL,
  PRIMARY KEY (country_id))
;


-- -----------------------------------------------------
-- Table mydb.userCountry
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS mydb.userCountry (
  user_id INT NOT NULL,
  country_id CHAR(5) NOT NULL,
  PRIMARY KEY (user_id, country_id),
  CONSTRAINT fk_userCountry_user1
    FOREIGN KEY (user_id)
    REFERENCES mydb.user (user_id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_userCountry_country1
    FOREIGN KEY (country_id)
    REFERENCES mydb.country (country_id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
;


-- -----------------------------------------------------
-- Table mydb.etatCampain
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS mydb.etatCampain (
  etat_id CHAR(5) NOT NULL,
  PRIMARY KEY (etat_id))
;


-- -----------------------------------------------------
-- Table mydb.campain
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS mydb.campain (
  campain_id INT NOT NULL,
  title VARCHAR(45) NOT NULL,
  description VARCHAR(500) NOT NULL,
  budget DECIMAL(30) NOT NULL,
  userReward DECIMAL(30) NOT NULL,
  nbFollowerMin INT NOT NULL,
  imageURL VARCHAR(45) NOT NULL,
  createdAt TIMESTAMP NOT NULL,
  deletedAt TIMESTAMP NOT NULL,
  user_id INT NOT NULL,
  etat_id CHAR(5) NOT NULL,
  PRIMARY KEY (campain_id),
  CONSTRAINT fk_campain_etatCampain1
    FOREIGN KEY (etat_id)
    REFERENCES mydb.etatCampain (etat_id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_campain_user1
    FOREIGN KEY (user_id)
    REFERENCES mydb.user (user_id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
;


-- -----------------------------------------------------
-- Table mydb.etatCampainWhiteList
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS mydb.etatCampainWhiteList (
  etatCampainWhiteList_id CHAR(5) NOT NULL,
  PRIMARY KEY (etatCampainWhiteList_id))
;


-- -----------------------------------------------------
-- Table mydb.campainWhiteList
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS mydb.campainWhiteList (
  campain_id INT NOT NULL,
  user_id INT NOT NULL,
  etatCampainWhiteList_id CHAR(5) NOT NULL,
  PRIMARY KEY (campain_id, user_id),
  CONSTRAINT fk_campainWhiteList_campain1
    FOREIGN KEY (campain_id)
    REFERENCES mydb.campain (campain_id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_campainWhiteList_user1
    FOREIGN KEY (user_id)
    REFERENCES mydb.user (user_id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_campainWhiteList_etatCampainWhiteList1
    FOREIGN KEY (etatCampainWhiteList_id)
    REFERENCES mydb.etatCampainWhiteList (etatCampainWhiteList_id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
;
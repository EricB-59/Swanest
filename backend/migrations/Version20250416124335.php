<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250416124335 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE block_reports (id INT AUTO_INCREMENT NOT NULL, reporter_id INT NOT NULL, reported_id INT NOT NULL, reason LONGTEXT NOT NULL, reported_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_8B3C53BBE1CFE6F5 (reporter_id), INDEX IDX_8B3C53BB94BDEEB6 (reported_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE chats (id INT AUTO_INCREMENT NOT NULL, user1_id INT NOT NULL, user2_id INT NOT NULL, INDEX IDX_2D68180F56AE248B (user1_id), INDEX IDX_2D68180F441B8B65 (user2_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE dislike (id INT AUTO_INCREMENT NOT NULL, disliker_id INT NOT NULL, disliked_id INT NOT NULL, disliked_at DATETIME NOT NULL, INDEX IDX_FE3BECAA9DEB4BAF (disliker_id), INDEX IDX_FE3BECAAE89943EC (disliked_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE feedback_support (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(50) NOT NULL, subject LONGTEXT NOT NULL, message LONGTEXT NOT NULL, submitted_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE genders (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(25) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE images (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, image_1 LONGTEXT NOT NULL, image_2 LONGTEXT NOT NULL, image_3 LONGTEXT DEFAULT NULL, image_4 LONGTEXT DEFAULT NULL, image_5 LONGTEXT DEFAULT NULL, uploaded_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', UNIQUE INDEX UNIQ_E01FBE6AA76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE labels (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(25) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE likes (id INT AUTO_INCREMENT NOT NULL, liker_id INT NOT NULL, liked_id INT NOT NULL, liked_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_49CA4E7D979F103A (liker_id), INDEX IDX_49CA4E7DE2ED1879 (liked_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE matches (id INT AUTO_INCREMENT NOT NULL, user1_id INT NOT NULL, user2_id INT NOT NULL, matched_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_62615BA56AE248B (user1_id), INDEX IDX_62615BA441B8B65 (user2_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE messages (id INT AUTO_INCREMENT NOT NULL, chat_id INT NOT NULL, sender_id INT NOT NULL, receiver_id INT NOT NULL, content LONGTEXT NOT NULL, is_read TINYINT(1) NOT NULL, sent_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_DB021E961A9A7125 (chat_id), INDEX IDX_DB021E96F624B39D (sender_id), INDEX IDX_DB021E96CD53EDB6 (receiver_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE preferences (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, province_id INT NOT NULL, gender_id INT NOT NULL, age_min INT NOT NULL, age_max INT NOT NULL, UNIQUE INDEX UNIQ_E931A6F5A76ED395 (user_id), INDEX IDX_E931A6F5E946114A (province_id), INDEX IDX_E931A6F5708A0E0 (gender_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE profiles (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, gender_id INT DEFAULT NULL, province_id INT DEFAULT NULL, labels_id INT NOT NULL, first_name VARCHAR(25) NOT NULL, last_name VARCHAR(25) NOT NULL, bio LONGTEXT DEFAULT NULL, birthdate DATE DEFAULT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', updated_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', UNIQUE INDEX UNIQ_8B308530A76ED395 (user_id), INDEX IDX_8B308530708A0E0 (gender_id), INDEX IDX_8B308530E946114A (province_id), UNIQUE INDEX UNIQ_8B308530B8478C02 (labels_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE provinces (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(25) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user_label (id INT AUTO_INCREMENT NOT NULL, first_label_id INT NOT NULL, second_label_id INT NOT NULL, third_label_id INT DEFAULT NULL, fourth_label_id INT DEFAULT NULL, fifth_label_id INT DEFAULT NULL, INDEX IDX_EC65ABB087A11D62 (first_label_id), INDEX IDX_EC65ABB0AD705C (second_label_id), INDEX IDX_EC65ABB046412BFC (third_label_id), INDEX IDX_EC65ABB0754F62D7 (fourth_label_id), INDEX IDX_EC65ABB09C16BF04 (fifth_label_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE users (id INT AUTO_INCREMENT NOT NULL, username VARCHAR(25) NOT NULL, email VARCHAR(50) NOT NULL, password VARCHAR(255) NOT NULL, created_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', roles JSON NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE block_reports ADD CONSTRAINT FK_8B3C53BBE1CFE6F5 FOREIGN KEY (reporter_id) REFERENCES users (id)');
        $this->addSql('ALTER TABLE block_reports ADD CONSTRAINT FK_8B3C53BB94BDEEB6 FOREIGN KEY (reported_id) REFERENCES users (id)');
        $this->addSql('ALTER TABLE chats ADD CONSTRAINT FK_2D68180F56AE248B FOREIGN KEY (user1_id) REFERENCES users (id)');
        $this->addSql('ALTER TABLE chats ADD CONSTRAINT FK_2D68180F441B8B65 FOREIGN KEY (user2_id) REFERENCES users (id)');
        $this->addSql('ALTER TABLE dislike ADD CONSTRAINT FK_FE3BECAA9DEB4BAF FOREIGN KEY (disliker_id) REFERENCES users (id)');
        $this->addSql('ALTER TABLE dislike ADD CONSTRAINT FK_FE3BECAAE89943EC FOREIGN KEY (disliked_id) REFERENCES users (id)');
        $this->addSql('ALTER TABLE images ADD CONSTRAINT FK_E01FBE6AA76ED395 FOREIGN KEY (user_id) REFERENCES users (id)');
        $this->addSql('ALTER TABLE likes ADD CONSTRAINT FK_49CA4E7D979F103A FOREIGN KEY (liker_id) REFERENCES users (id)');
        $this->addSql('ALTER TABLE likes ADD CONSTRAINT FK_49CA4E7DE2ED1879 FOREIGN KEY (liked_id) REFERENCES users (id)');
        $this->addSql('ALTER TABLE matches ADD CONSTRAINT FK_62615BA56AE248B FOREIGN KEY (user1_id) REFERENCES users (id)');
        $this->addSql('ALTER TABLE matches ADD CONSTRAINT FK_62615BA441B8B65 FOREIGN KEY (user2_id) REFERENCES users (id)');
        $this->addSql('ALTER TABLE messages ADD CONSTRAINT FK_DB021E961A9A7125 FOREIGN KEY (chat_id) REFERENCES chats (id)');
        $this->addSql('ALTER TABLE messages ADD CONSTRAINT FK_DB021E96F624B39D FOREIGN KEY (sender_id) REFERENCES users (id)');
        $this->addSql('ALTER TABLE messages ADD CONSTRAINT FK_DB021E96CD53EDB6 FOREIGN KEY (receiver_id) REFERENCES users (id)');
        $this->addSql('ALTER TABLE preferences ADD CONSTRAINT FK_E931A6F5A76ED395 FOREIGN KEY (user_id) REFERENCES users (id)');
        $this->addSql('ALTER TABLE preferences ADD CONSTRAINT FK_E931A6F5E946114A FOREIGN KEY (province_id) REFERENCES provinces (id)');
        $this->addSql('ALTER TABLE preferences ADD CONSTRAINT FK_E931A6F5708A0E0 FOREIGN KEY (gender_id) REFERENCES genders (id)');
        $this->addSql('ALTER TABLE profiles ADD CONSTRAINT FK_8B308530A76ED395 FOREIGN KEY (user_id) REFERENCES users (id)');
        $this->addSql('ALTER TABLE profiles ADD CONSTRAINT FK_8B308530708A0E0 FOREIGN KEY (gender_id) REFERENCES genders (id)');
        $this->addSql('ALTER TABLE profiles ADD CONSTRAINT FK_8B308530E946114A FOREIGN KEY (province_id) REFERENCES provinces (id)');
        $this->addSql('ALTER TABLE profiles ADD CONSTRAINT FK_8B308530B8478C02 FOREIGN KEY (labels_id) REFERENCES user_label (id)');
        $this->addSql('ALTER TABLE user_label ADD CONSTRAINT FK_EC65ABB087A11D62 FOREIGN KEY (first_label_id) REFERENCES labels (id)');
        $this->addSql('ALTER TABLE user_label ADD CONSTRAINT FK_EC65ABB0AD705C FOREIGN KEY (second_label_id) REFERENCES labels (id)');
        $this->addSql('ALTER TABLE user_label ADD CONSTRAINT FK_EC65ABB046412BFC FOREIGN KEY (third_label_id) REFERENCES labels (id)');
        $this->addSql('ALTER TABLE user_label ADD CONSTRAINT FK_EC65ABB0754F62D7 FOREIGN KEY (fourth_label_id) REFERENCES labels (id)');
        $this->addSql('ALTER TABLE user_label ADD CONSTRAINT FK_EC65ABB09C16BF04 FOREIGN KEY (fifth_label_id) REFERENCES labels (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE block_reports DROP FOREIGN KEY FK_8B3C53BBE1CFE6F5');
        $this->addSql('ALTER TABLE block_reports DROP FOREIGN KEY FK_8B3C53BB94BDEEB6');
        $this->addSql('ALTER TABLE chats DROP FOREIGN KEY FK_2D68180F56AE248B');
        $this->addSql('ALTER TABLE chats DROP FOREIGN KEY FK_2D68180F441B8B65');
        $this->addSql('ALTER TABLE dislike DROP FOREIGN KEY FK_FE3BECAA9DEB4BAF');
        $this->addSql('ALTER TABLE dislike DROP FOREIGN KEY FK_FE3BECAAE89943EC');
        $this->addSql('ALTER TABLE images DROP FOREIGN KEY FK_E01FBE6AA76ED395');
        $this->addSql('ALTER TABLE likes DROP FOREIGN KEY FK_49CA4E7D979F103A');
        $this->addSql('ALTER TABLE likes DROP FOREIGN KEY FK_49CA4E7DE2ED1879');
        $this->addSql('ALTER TABLE matches DROP FOREIGN KEY FK_62615BA56AE248B');
        $this->addSql('ALTER TABLE matches DROP FOREIGN KEY FK_62615BA441B8B65');
        $this->addSql('ALTER TABLE messages DROP FOREIGN KEY FK_DB021E961A9A7125');
        $this->addSql('ALTER TABLE messages DROP FOREIGN KEY FK_DB021E96F624B39D');
        $this->addSql('ALTER TABLE messages DROP FOREIGN KEY FK_DB021E96CD53EDB6');
        $this->addSql('ALTER TABLE preferences DROP FOREIGN KEY FK_E931A6F5A76ED395');
        $this->addSql('ALTER TABLE preferences DROP FOREIGN KEY FK_E931A6F5E946114A');
        $this->addSql('ALTER TABLE preferences DROP FOREIGN KEY FK_E931A6F5708A0E0');
        $this->addSql('ALTER TABLE profiles DROP FOREIGN KEY FK_8B308530A76ED395');
        $this->addSql('ALTER TABLE profiles DROP FOREIGN KEY FK_8B308530708A0E0');
        $this->addSql('ALTER TABLE profiles DROP FOREIGN KEY FK_8B308530E946114A');
        $this->addSql('ALTER TABLE profiles DROP FOREIGN KEY FK_8B308530B8478C02');
        $this->addSql('ALTER TABLE user_label DROP FOREIGN KEY FK_EC65ABB087A11D62');
        $this->addSql('ALTER TABLE user_label DROP FOREIGN KEY FK_EC65ABB0AD705C');
        $this->addSql('ALTER TABLE user_label DROP FOREIGN KEY FK_EC65ABB046412BFC');
        $this->addSql('ALTER TABLE user_label DROP FOREIGN KEY FK_EC65ABB0754F62D7');
        $this->addSql('ALTER TABLE user_label DROP FOREIGN KEY FK_EC65ABB09C16BF04');
        $this->addSql('DROP TABLE block_reports');
        $this->addSql('DROP TABLE chats');
        $this->addSql('DROP TABLE dislike');
        $this->addSql('DROP TABLE feedback_support');
        $this->addSql('DROP TABLE genders');
        $this->addSql('DROP TABLE images');
        $this->addSql('DROP TABLE labels');
        $this->addSql('DROP TABLE likes');
        $this->addSql('DROP TABLE matches');
        $this->addSql('DROP TABLE messages');
        $this->addSql('DROP TABLE preferences');
        $this->addSql('DROP TABLE profiles');
        $this->addSql('DROP TABLE provinces');
        $this->addSql('DROP TABLE user_label');
        $this->addSql('DROP TABLE users');
    }
}

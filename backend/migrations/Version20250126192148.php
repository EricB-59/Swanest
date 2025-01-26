<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250126192148 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE block_report (id INT AUTO_INCREMENT NOT NULL, reporter_id_id INT NOT NULL, reported_id_id INT NOT NULL, reason LONGTEXT NOT NULL, reported_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_8D81210FD6B1FFA1 (reporter_id_id), INDEX IDX_8D81210FD2BF5655 (reported_id_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE feedback_support (id INT AUTO_INCREMENT NOT NULL, user_id_id INT NOT NULL, feedback LONGTEXT NOT NULL, submitted_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_115DCB069D86650F (user_id_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE gender (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(50) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE likes (id INT AUTO_INCREMENT NOT NULL, liker_id_id INT NOT NULL, liked_id_id INT NOT NULL, liked_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_49CA4E7D65CF3965 (liker_id_id), INDEX IDX_49CA4E7D61C19091 (liked_id_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE matches (id INT AUTO_INCREMENT NOT NULL, user1_id_id INT NOT NULL, user2_id_id INT NOT NULL, matched_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_62615BA4BA75E4E (user1_id_id), INDEX IDX_62615BA7A4F44D3 (user2_id_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE messages (id INT AUTO_INCREMENT NOT NULL, sender_id_id INT NOT NULL, receiver_id_id INT NOT NULL, content LONGTEXT NOT NULL, sent_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_DB021E966061F7CF (sender_id_id), INDEX IDX_DB021E96BE20CAB0 (receiver_id_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE notifications (id INT AUTO_INCREMENT NOT NULL, user_id_id INT NOT NULL, message_id_id INT NOT NULL, created_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', is_read TINYINT(1) NOT NULL, INDEX IDX_6000B0D39D86650F (user_id_id), UNIQUE INDEX UNIQ_6000B0D380E261BC (message_id_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE photos (id INT AUTO_INCREMENT NOT NULL, user_id_id INT NOT NULL, photo_1 LONGTEXT NOT NULL, photo_2 LONGTEXT NOT NULL, photo_3 LONGTEXT DEFAULT NULL, photo_4 LONGTEXT DEFAULT NULL, photo_5 LONGTEXT DEFAULT NULL, uploaded_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', UNIQUE INDEX UNIQ_876E0D99D86650F (user_id_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE preferences (id INT AUTO_INCREMENT NOT NULL, user_id_id INT NOT NULL, province_id_id INT NOT NULL, age_min INT NOT NULL, age_max INT NOT NULL, UNIQUE INDEX UNIQ_E931A6F59D86650F (user_id_id), INDEX IDX_E931A6F5D72A0A7A (province_id_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE profiles (id INT AUTO_INCREMENT NOT NULL, user_id_id INT NOT NULL, gender_id_id INT NOT NULL, province_id_id INT NOT NULL, first_name VARCHAR(25) NOT NULL, last_name VARCHAR(25) NOT NULL, bio LONGTEXT NOT NULL, birthdate DATE NOT NULL, UNIQUE INDEX UNIQ_8B3085309D86650F (user_id_id), INDEX IDX_8B3085306F7F214C (gender_id_id), INDEX IDX_8B308530D72A0A7A (province_id_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE province (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(25) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, username VARCHAR(25) NOT NULL, email VARCHAR(50) NOT NULL, password VARCHAR(25) NOT NULL, created_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE block_report ADD CONSTRAINT FK_8D81210FD6B1FFA1 FOREIGN KEY (reporter_id_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE block_report ADD CONSTRAINT FK_8D81210FD2BF5655 FOREIGN KEY (reported_id_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE feedback_support ADD CONSTRAINT FK_115DCB069D86650F FOREIGN KEY (user_id_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE likes ADD CONSTRAINT FK_49CA4E7D65CF3965 FOREIGN KEY (liker_id_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE likes ADD CONSTRAINT FK_49CA4E7D61C19091 FOREIGN KEY (liked_id_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE matches ADD CONSTRAINT FK_62615BA4BA75E4E FOREIGN KEY (user1_id_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE matches ADD CONSTRAINT FK_62615BA7A4F44D3 FOREIGN KEY (user2_id_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE messages ADD CONSTRAINT FK_DB021E966061F7CF FOREIGN KEY (sender_id_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE messages ADD CONSTRAINT FK_DB021E96BE20CAB0 FOREIGN KEY (receiver_id_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE notifications ADD CONSTRAINT FK_6000B0D39D86650F FOREIGN KEY (user_id_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE notifications ADD CONSTRAINT FK_6000B0D380E261BC FOREIGN KEY (message_id_id) REFERENCES messages (id)');
        $this->addSql('ALTER TABLE photos ADD CONSTRAINT FK_876E0D99D86650F FOREIGN KEY (user_id_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE preferences ADD CONSTRAINT FK_E931A6F59D86650F FOREIGN KEY (user_id_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE preferences ADD CONSTRAINT FK_E931A6F5D72A0A7A FOREIGN KEY (province_id_id) REFERENCES province (id)');
        $this->addSql('ALTER TABLE profiles ADD CONSTRAINT FK_8B3085309D86650F FOREIGN KEY (user_id_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE profiles ADD CONSTRAINT FK_8B3085306F7F214C FOREIGN KEY (gender_id_id) REFERENCES gender (id)');
        $this->addSql('ALTER TABLE profiles ADD CONSTRAINT FK_8B308530D72A0A7A FOREIGN KEY (province_id_id) REFERENCES province (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE block_report DROP FOREIGN KEY FK_8D81210FD6B1FFA1');
        $this->addSql('ALTER TABLE block_report DROP FOREIGN KEY FK_8D81210FD2BF5655');
        $this->addSql('ALTER TABLE feedback_support DROP FOREIGN KEY FK_115DCB069D86650F');
        $this->addSql('ALTER TABLE likes DROP FOREIGN KEY FK_49CA4E7D65CF3965');
        $this->addSql('ALTER TABLE likes DROP FOREIGN KEY FK_49CA4E7D61C19091');
        $this->addSql('ALTER TABLE matches DROP FOREIGN KEY FK_62615BA4BA75E4E');
        $this->addSql('ALTER TABLE matches DROP FOREIGN KEY FK_62615BA7A4F44D3');
        $this->addSql('ALTER TABLE messages DROP FOREIGN KEY FK_DB021E966061F7CF');
        $this->addSql('ALTER TABLE messages DROP FOREIGN KEY FK_DB021E96BE20CAB0');
        $this->addSql('ALTER TABLE notifications DROP FOREIGN KEY FK_6000B0D39D86650F');
        $this->addSql('ALTER TABLE notifications DROP FOREIGN KEY FK_6000B0D380E261BC');
        $this->addSql('ALTER TABLE photos DROP FOREIGN KEY FK_876E0D99D86650F');
        $this->addSql('ALTER TABLE preferences DROP FOREIGN KEY FK_E931A6F59D86650F');
        $this->addSql('ALTER TABLE preferences DROP FOREIGN KEY FK_E931A6F5D72A0A7A');
        $this->addSql('ALTER TABLE profiles DROP FOREIGN KEY FK_8B3085309D86650F');
        $this->addSql('ALTER TABLE profiles DROP FOREIGN KEY FK_8B3085306F7F214C');
        $this->addSql('ALTER TABLE profiles DROP FOREIGN KEY FK_8B308530D72A0A7A');
        $this->addSql('DROP TABLE block_report');
        $this->addSql('DROP TABLE feedback_support');
        $this->addSql('DROP TABLE gender');
        $this->addSql('DROP TABLE likes');
        $this->addSql('DROP TABLE matches');
        $this->addSql('DROP TABLE messages');
        $this->addSql('DROP TABLE notifications');
        $this->addSql('DROP TABLE photos');
        $this->addSql('DROP TABLE preferences');
        $this->addSql('DROP TABLE profiles');
        $this->addSql('DROP TABLE province');
        $this->addSql('DROP TABLE user');
    }
}

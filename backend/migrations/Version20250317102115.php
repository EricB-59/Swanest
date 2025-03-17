<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250317102115 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE feedback_support (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(50) NOT NULL, subject LONGTEXT NOT NULL, message LONGTEXT NOT NULL, submitted_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE gender (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(25) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE label (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(25) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE profile (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, gender_id INT DEFAULT NULL, province_id INT DEFAULT NULL, labels_id INT NOT NULL, first_name VARCHAR(25) NOT NULL, last_name VARCHAR(25) NOT NULL, bio LONGTEXT DEFAULT NULL, birthdate DATE DEFAULT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', updated_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', UNIQUE INDEX UNIQ_8157AA0FA76ED395 (user_id), INDEX IDX_8157AA0F708A0E0 (gender_id), INDEX IDX_8157AA0FE946114A (province_id), UNIQUE INDEX UNIQ_8157AA0FB8478C02 (labels_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE province (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(25) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, username VARCHAR(25) NOT NULL, email VARCHAR(50) NOT NULL, password VARCHAR(25) NOT NULL, created_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user_label (id INT AUTO_INCREMENT NOT NULL, first_label_id INT NOT NULL, second_label_id INT NOT NULL, third_label_id INT DEFAULT NULL, fourth_label_id INT DEFAULT NULL, fifth_label_id INT DEFAULT NULL, INDEX IDX_EC65ABB087A11D62 (first_label_id), INDEX IDX_EC65ABB0AD705C (second_label_id), INDEX IDX_EC65ABB046412BFC (third_label_id), INDEX IDX_EC65ABB0754F62D7 (fourth_label_id), INDEX IDX_EC65ABB09C16BF04 (fifth_label_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE profile ADD CONSTRAINT FK_8157AA0FA76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE profile ADD CONSTRAINT FK_8157AA0F708A0E0 FOREIGN KEY (gender_id) REFERENCES gender (id)');
        $this->addSql('ALTER TABLE profile ADD CONSTRAINT FK_8157AA0FE946114A FOREIGN KEY (province_id) REFERENCES province (id)');
        $this->addSql('ALTER TABLE profile ADD CONSTRAINT FK_8157AA0FB8478C02 FOREIGN KEY (labels_id) REFERENCES user_label (id)');
        $this->addSql('ALTER TABLE user_label ADD CONSTRAINT FK_EC65ABB087A11D62 FOREIGN KEY (first_label_id) REFERENCES label (id)');
        $this->addSql('ALTER TABLE user_label ADD CONSTRAINT FK_EC65ABB0AD705C FOREIGN KEY (second_label_id) REFERENCES label (id)');
        $this->addSql('ALTER TABLE user_label ADD CONSTRAINT FK_EC65ABB046412BFC FOREIGN KEY (third_label_id) REFERENCES label (id)');
        $this->addSql('ALTER TABLE user_label ADD CONSTRAINT FK_EC65ABB0754F62D7 FOREIGN KEY (fourth_label_id) REFERENCES label (id)');
        $this->addSql('ALTER TABLE user_label ADD CONSTRAINT FK_EC65ABB09C16BF04 FOREIGN KEY (fifth_label_id) REFERENCES label (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE profile DROP FOREIGN KEY FK_8157AA0FA76ED395');
        $this->addSql('ALTER TABLE profile DROP FOREIGN KEY FK_8157AA0F708A0E0');
        $this->addSql('ALTER TABLE profile DROP FOREIGN KEY FK_8157AA0FE946114A');
        $this->addSql('ALTER TABLE profile DROP FOREIGN KEY FK_8157AA0FB8478C02');
        $this->addSql('ALTER TABLE user_label DROP FOREIGN KEY FK_EC65ABB087A11D62');
        $this->addSql('ALTER TABLE user_label DROP FOREIGN KEY FK_EC65ABB0AD705C');
        $this->addSql('ALTER TABLE user_label DROP FOREIGN KEY FK_EC65ABB046412BFC');
        $this->addSql('ALTER TABLE user_label DROP FOREIGN KEY FK_EC65ABB0754F62D7');
        $this->addSql('ALTER TABLE user_label DROP FOREIGN KEY FK_EC65ABB09C16BF04');
        $this->addSql('DROP TABLE feedback_support');
        $this->addSql('DROP TABLE gender');
        $this->addSql('DROP TABLE label');
        $this->addSql('DROP TABLE profile');
        $this->addSql('DROP TABLE province');
        $this->addSql('DROP TABLE user');
        $this->addSql('DROP TABLE user_label');
    }
}

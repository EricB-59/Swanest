<?php

namespace App\Entity;

use App\Repository\PhotosRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: PhotosRepository::class)]
class Photos
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?int $user_id = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $photo_1 = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $photo_2 = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $photo_3 = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $photo_4 = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $photo_5 = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $uploaded_at = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(int $id): static
    {
        $this->id = $id;

        return $this;
    }

    public function getUserId(): ?int
    {
        return $this->user_id;
    }

    public function setUserId(int $user_id): static
    {
        $this->user_id = $user_id;

        return $this;
    }

    public function getPhoto1(): ?string
    {
        return $this->photo_1;
    }

    public function setPhoto1(string $photo_1): static
    {
        $this->photo_1 = $photo_1;

        return $this;
    }

    public function getPhoto2(): ?string
    {
        return $this->photo_2;
    }

    public function setPhoto2(string $photo_2): static
    {
        $this->photo_2 = $photo_2;

        return $this;
    }

    public function getPhoto3(): ?string
    {
        return $this->photo_3;
    }

    public function setPhoto3(?string $photo_3): static
    {
        $this->photo_3 = $photo_3;

        return $this;
    }

    public function getPhoto4(): ?string
    {
        return $this->photo_4;
    }

    public function setPhoto4(?string $photo_4): static
    {
        $this->photo_4 = $photo_4;

        return $this;
    }

    public function getPhoto5(): ?string
    {
        return $this->photo_5;
    }

    public function setPhoto5(?string $photo_5): static
    {
        $this->photo_5 = $photo_5;

        return $this;
    }

    public function getUploadedAt(): ?\DateTimeImmutable
    {
        return $this->uploaded_at;
    }

    public function setUploadedAt(?\DateTimeImmutable $uploaded_at): static
    {
        $this->uploaded_at = $uploaded_at;

        return $this;
    }
}

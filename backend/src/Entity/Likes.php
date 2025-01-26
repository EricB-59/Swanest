<?php

namespace App\Entity;

use App\Repository\LikesRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: LikesRepository::class)]
class Likes
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?int $liker_id = null;

    #[ORM\Column]
    private ?int $liked_id = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $liked_at = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(int $id): static
    {
        $this->id = $id;

        return $this;
    }

    public function getLikerId(): ?int
    {
        return $this->liker_id;
    }

    public function setLikerId(int $liker_id): static
    {
        $this->liker_id = $liker_id;

        return $this;
    }

    public function getLikedId(): ?int
    {
        return $this->liked_id;
    }

    public function setLikedId(int $liked_id): static
    {
        $this->liked_id = $liked_id;

        return $this;
    }

    public function getLikedAt(): ?\DateTimeImmutable
    {
        return $this->liked_at;
    }

    public function setLikedAt(?\DateTimeImmutable $liked_at): static
    {
        $this->liked_at = $liked_at;

        return $this;
    }
}

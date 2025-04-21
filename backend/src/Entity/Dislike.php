<?php

namespace App\Entity;

use App\Repository\DislikeRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: DislikeRepository::class)]
#[ORM\Table(name: "dislikes")]
class Dislike
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'dislikeGiven')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $disliker = null;

    #[ORM\ManyToOne(inversedBy: 'dislikesReceived')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $disliked = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $disliked_at = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDisliker(): ?User
    {
        return $this->disliker;
    }

    public function setDisliker(?User $disliker): static
    {
        $this->disliker = $disliker;

        return $this;
    }

    public function getDisliked(): ?User
    {
        return $this->disliked;
    }

    public function setDisliked(?User $disliked): static
    {
        $this->disliked = $disliked;

        return $this;
    }

    public function getDislikedAt(): ?\DateTimeInterface
    {
        return $this->disliked_at;
    }

    public function setDislikedAt(\DateTimeInterface $disliked_at): static
    {
        $this->disliked_at = $disliked_at;

        return $this;
    }
}

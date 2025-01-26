<?php

namespace App\Entity;

use App\Repository\MatchesRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: MatchesRepository::class)]
class Matches
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'matches')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user1_id = null;

    #[ORM\ManyToOne(inversedBy: 'matches')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user2_id = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $matched_at = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(int $id): static
    {
        $this->id = $id;

        return $this;
    }

    public function getUser1Id(): ?User
    {
        return $this->user1_id;
    }

    public function setUser1Id(?User $user1_id): static
    {
        $this->user1_id = $user1_id;

        return $this;
    }

    public function getUser2Id(): ?User
    {
        return $this->user2_id;
    }

    public function setUser2Id(?User $user2_id): static
    {
        $this->user2_id = $user2_id;

        return $this;
    }

    public function getMatchedAt(): ?\DateTimeImmutable
    {
        return $this->matched_at;
    }

    public function setMatchedAt(?\DateTimeImmutable $matched_at): static
    {
        $this->matched_at = $matched_at;

        return $this;
    }
}

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

    #[ORM\Column]
    private ?int $user1_id = null;

    #[ORM\Column]
    private ?int $user2_id = null;

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

    public function getUser1Id(): ?int
    {
        return $this->user1_id;
    }

    public function setUser1Id(int $user1_id): static
    {
        $this->user1_id = $user1_id;

        return $this;
    }

    public function getUser2Id(): ?int
    {
        return $this->user2_id;
    }

    public function setUser2Id(int $user2_id): static
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

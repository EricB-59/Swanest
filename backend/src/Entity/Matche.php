<?php

namespace App\Entity;

use App\Repository\MatcheRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: MatcheRepository::class)]
#[ORM\Table(name: "matches")]
class Matche
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'matches')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user1 = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user2 = null;

    #[ORM\Column]
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

    public function getUser1(): ?User
    {
        return $this->user1;
    }

    public function setUser1(?User $user1): static
    {
        $this->user1 = $user1;

        return $this;
    }

    public function getUser2(): ?User
    {
        return $this->user2;
    }

    public function setUser2(?User $user2): static
    {
        $this->user2 = $user2;

        return $this;
    }

    public function getMatchedAt(): ?\DateTimeImmutable
    {
        return $this->matched_at;
    }

    public function setMatchedAt(\DateTimeImmutable $matched_at): static
    {
        $this->matched_at = $matched_at;

        return $this;
    }

    /**
     * Convierte el objeto Matche y sus relaciones a un array asociativo
     * 
     * @return array
     */
    public function toArray(): array
    {
        $matchData = [
            'id' => $this->getId(),
            'matched_at' => $this->getMatchedAt() ? $this->getMatchedAt()->format('Y-m-d H:i:s') : null,
        ];

        // No incluimos los objetos completos de usuario para evitar referencias circulares
        // Solo incluimos los IDs de los usuarios
        $matchData['user1_id'] = $this->getUser1() ? $this->getUser1()->getId() : null;
        $matchData['user2_id'] = $this->getUser2() ? $this->getUser2()->getId() : null;

        // Opcionalmente, podemos incluir información básica de los usuarios
        if ($this->getUser1()) {
            $matchData['user1_username'] = $this->getUser1()->getUsername();
        }

        if ($this->getUser2()) {
            $matchData['user2_username'] = $this->getUser2()->getUsername();
        }

        return $matchData;
    }
}

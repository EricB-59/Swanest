<?php

namespace App\Entity;

use App\Repository\LikeRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: LikeRepository::class)]
#[ORM\Table(name: 'likes')]
class Like
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'likes')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $liker = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $liked = null;

    #[ORM\Column]
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

    public function getLiker(): ?User
    {
        return $this->liker;
    }

    public function setLiker(?User $liker): static
    {
        $this->liker = $liker;

        return $this;
    }

    public function getLiked(): ?User
    {
        return $this->liked;
    }

    public function setLiked(?User $liked): static
    {
        $this->liked = $liked;

        return $this;
    }

    public function getLikedAt(): ?\DateTimeImmutable
    {
        return $this->liked_at;
    }

    public function setLikedAt(\DateTimeImmutable $liked_at): static
    {
        $this->liked_at = $liked_at;

        return $this;
    }

    /**
     * Convierte el objeto Like y sus relaciones a un array asociativo
     * 
     * @return array
     */
    public function toArray(): array
    {
        $likeData = [
            'id' => $this->getId(),
            'liked_at' => $this->getLikedAt() ? $this->getLikedAt()->format('Y-m-d H:i:s') : null,
        ];

        // No incluimos los objetos completos de usuario para evitar referencias circulares
        // Solo incluimos los IDs de los usuarios
        $likeData['liker_id'] = $this->getLiker() ? $this->getLiker()->getId() : null;
        $likeData['liked_id'] = $this->getLiked() ? $this->getLiked()->getId() : null;

        // Opcionalmente, podemos incluir información básica del usuario que dio like y el que recibió like
        if ($this->getLiker()) {
            $likeData['liker_username'] = $this->getLiker()->getUsername();
        }

        if ($this->getLiked()) {
            $likeData['liked_username'] = $this->getLiked()->getUsername();
        }

        return $likeData;
    }
}

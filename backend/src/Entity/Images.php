<?php

namespace App\Entity;

use App\Repository\ImagesRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ImagesRepository::class)]
#[ORM\Table(name: "images")]
class Images
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\OneToOne(inversedBy: 'image', cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $image_1 = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $image_2 = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $image_3 = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $image_4 = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $image_5 = null;

    #[ORM\Column]
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

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(User $user): static
    {
        $this->user = $user;

        return $this;
    }

    public function getImage1(): ?string
    {
        return $this->image_1;
    }

    public function setImage1(string $image_1): static
    {
        $this->image_1 = $image_1;

        return $this;
    }

    public function getImage2(): ?string
    {
        return $this->image_2;
    }

    public function setImage2(string $image_2): static
    {
        $this->image_2 = $image_2;

        return $this;
    }

    public function getImage3(): ?string
    {
        return $this->image_3;
    }

    public function setImage3(?string $image_3): static
    {
        $this->image_3 = $image_3;

        return $this;
    }

    public function getImage4(): ?string
    {
        return $this->image_4;
    }

    public function setImage4(?string $image_4): static
    {
        $this->image_4 = $image_4;

        return $this;
    }

    public function getImage5(): ?string
    {
        return $this->image_5;
    }

    public function setImage5(?string $image_5): static
    {
        $this->image_5 = $image_5;

        return $this;
    }

    public function getUploadedAt(): ?\DateTimeImmutable
    {
        return $this->uploaded_at;
    }

    public function setUploadedAt(\DateTimeImmutable $uploaded_at): static
    {
        $this->uploaded_at = $uploaded_at;

        return $this;
    }

    /**
     * Convierte el objeto Images y sus relaciones a un array asociativo
     * 
     * @return array
     */
    public function toArray(): array
    {
        $imagesData = [
            'id' => $this->getId(),
            'image_1' => $this->getImage1(),
            'image_2' => $this->getImage2(),
            'image_3' => $this->getImage3(),
            'image_4' => $this->getImage4(),
            'image_5' => $this->getImage5(),
            'uploaded_at' => $this->getUploadedAt() ? $this->getUploadedAt()->format('Y-m-d H:i:s') : null,
        ];

        // No incluimos la referencia al usuario para evitar referencias circulares
        // Solo incluimos el ID del usuario
        $imagesData['user_id'] = $this->getUser() ? $this->getUser()->getId() : null;

        return $imagesData;
    }
}

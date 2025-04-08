<?php

namespace App\Entity;

use App\Repository\ProfileRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ProfileRepository::class)]
#[ORM\Table(name: "profiles")]
class Profile
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\OneToOne(inversedBy: 'profile', cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    #[ORM\Column(length: 25)]
    private ?string $first_name = null;

    #[ORM\Column(length: 25)]
    private ?string $last_name = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $bio = null;

    #[ORM\ManyToOne]
    private ?Gender $gender = null;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $birthdate = null;

    #[ORM\ManyToOne]
    private ?Province $province = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $created_at = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $updated_at = null;

    #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    private ?UserLabel $labels = null;

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

    public function getFirstName(): ?string
    {
        return $this->first_name;
    }

    public function setFirstName(string $first_name): static
    {
        $this->first_name = $first_name;

        return $this;
    }

    public function getLastName(): ?string
    {
        return $this->last_name;
    }

    public function setLastName(string $last_name): static
    {
        $this->last_name = $last_name;

        return $this;
    }

    public function getBio(): ?string
    {
        return $this->bio;
    }

    public function setBio(?string $bio): static
    {
        $this->bio = $bio;

        return $this;
    }

    public function getGender(): ?Gender
    {
        return $this->gender;
    }

    public function setGender(?Gender $gender): static
    {
        $this->gender = $gender;

        return $this;
    }

    public function getBirthdate(): ?\DateTimeInterface
    {
        return $this->birthdate;
    }

    public function setBirthdate(?\DateTimeInterface $birthdate): static
    {
        $this->birthdate = $birthdate;

        return $this;
    }

    public function getProvince(): ?Province
    {
        return $this->province;
    }

    public function setProvince(?Province $province): static
    {
        $this->province = $province;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->created_at;
    }

    public function setCreatedAt(\DateTimeImmutable $created_at): static
    {
        $this->created_at = $created_at;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updated_at;
    }

    public function setUpdatedAt(\DateTimeImmutable $updated_at): static
    {
        $this->updated_at = $updated_at;

        return $this;
    }

    public function getLabels(): ?UserLabel
    {
        return $this->labels;
    }

    public function setLabels(UserLabel $labels): static
    {
        $this->labels = $labels;

        return $this;
    }

    /**
     * Convierte el objeto Profile y sus relaciones a un array asociativo
     * 
     * @return array
     */
    public function toArray(): array
    {
        $profileData = [
            'id' => $this->getId(),
            'first_name' => $this->getFirstName(),
            'last_name' => $this->getLastName(),
            'bio' => $this->getBio(),
            'birthdate' => $this->getBirthdate() ? $this->getBirthdate()->format('Y-m-d') : null,
            'created_at' => $this->getCreatedAt() ? $this->getCreatedAt()->format('Y-m-d H:i:s') : null,
            'updated_at' => $this->getUpdatedAt() ? $this->getUpdatedAt()->format('Y-m-d H:i:s') : null,
        ];

        // Añadir gender si existe
        if ($this->getGender()) {
            $profileData['gender'] = $this->getGender()->toArray();
        }

        // Añadir province si existe
        if ($this->getProvince()) {
            $profileData['province'] = $this->getProvince()->toArray();
        }

        // Añadir labels
        if ($this->getLabels()) {
            $profileData['labels'] = $this->getLabels()->toArray();
        }

        // No incluimos la referencia al usuario para evitar referencias circulares
        // Si necesitas incluir el ID del usuario:
        $profileData['user_id'] = $this->getUser() ? $this->getUser()->getId() : null;

        return $profileData;
    }
}

<?php

namespace App\Entity;

use App\Repository\PreferenceRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: PreferenceRepository::class)]
#[ORM\Table(name: "preferences")]
class Preference
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\OneToOne(inversedBy: 'preference', cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    #[ORM\Column]
    private ?int $age_min = null;

    #[ORM\Column]
    private ?int $age_max = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?Province $province = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?Gender $gender = null;

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

    public function getAgeMin(): ?int
    {
        return $this->age_min;
    }

    public function setAgeMin(int $age_min): static
    {
        $this->age_min = $age_min;

        return $this;
    }

    public function getAgeMax(): ?int
    {
        return $this->age_max;
    }

    public function setAgeMax(int $age_max): static
    {
        $this->age_max = $age_max;

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

    public function getGender(): ?Gender
    {
        return $this->gender;
    }

    public function setGender(?Gender $gender): static
    {
        $this->gender = $gender;

        return $this;
    }

    /**
     * Convierte el objeto Preference y sus relaciones a un array asociativo
     * 
     * @return array
     */
    public function toArray(): array
    {
        $preferenceData = [
            'id' => $this->getId(),
            'age_min' => $this->getAgeMin(),
            'age_max' => $this->getAgeMax(),
        ];

        // Añadir province si existe
        if ($this->getProvince()) {
            $preferenceData['province'] = $this->getProvince()->toArray();
        }

        // Añadir gender si existe
        if ($this->getGender()) {
            $preferenceData['gender'] = $this->getGender()->toArray();
        }

        // No incluimos la referencia al usuario para evitar referencias circulares
        // Solo incluimos el ID del usuario
        $preferenceData['user_id'] = $this->getUser() ? $this->getUser()->getId() : null;

        return $preferenceData;
    }
}

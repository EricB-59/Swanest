<?php

namespace App\Entity;

use App\Repository\UserLabelRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: UserLabelRepository::class)]
class UserLabel
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?Label $first_label = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?Label $second_label = null;

    #[ORM\ManyToOne]
    private ?Label $third_label = null;

    #[ORM\ManyToOne]
    private ?Label $fourth_label = null;

    #[ORM\ManyToOne]
    private ?Label $fifth_label = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(int $id): static
    {
        $this->id = $id;

        return $this;
    }

    public function getFirstLabel(): ?Label
    {
        return $this->first_label;
    }

    public function setFirstLabel(?Label $first_label): static
    {
        $this->first_label = $first_label;

        return $this;
    }

    public function getSecondLabel(): ?Label
    {
        return $this->second_label;
    }

    public function setSecondLabel(?Label $second_label): static
    {
        $this->second_label = $second_label;

        return $this;
    }

    public function getThirdLabel(): ?Label
    {
        return $this->third_label;
    }

    public function setThirdLabel(?Label $third_label): static
    {
        $this->third_label = $third_label;

        return $this;
    }

    public function getFourthLabel(): ?Label
    {
        return $this->fourth_label;
    }

    public function setFourthLabel(?Label $fourth_label): static
    {
        $this->fourth_label = $fourth_label;

        return $this;
    }

    public function getFifthLabel(): ?Label
    {
        return $this->fifth_label;
    }

    public function setFifthLabel(?Label $fifth_label): static
    {
        $this->fifth_label = $fifth_label;

        return $this;
    }
}

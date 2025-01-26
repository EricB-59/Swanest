<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: UserRepository::class)]
class User
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 25)]
    private ?string $username = null;

    #[ORM\Column(length: 50)]
    private ?string $email = null;

    #[ORM\Column(length: 25)]
    private ?string $password = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $created_at = null;

    /**
     * @var Collection<int, FeedbackSupport>
     */
    #[ORM\OneToMany(targetEntity: FeedbackSupport::class, mappedBy: 'user_id')]
    private Collection $feedbackSupports;

    public function __construct()
    {
        $this->feedbackSupports = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(int $id): static
    {
        $this->id = $id;

        return $this;
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(string $username): static
    {
        $this->username = $username;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->created_at;
    }

    public function setCreatedAt(?\DateTimeImmutable $created_at): static
    {
        $this->created_at = $created_at;

        return $this;
    }

    /**
     * @return Collection<int, FeedbackSupport>
     */
    public function getFeedbackSupports(): Collection
    {
        return $this->feedbackSupports;
    }

    public function addFeedbackSupport(FeedbackSupport $feedbackSupport): static
    {
        if (!$this->feedbackSupports->contains($feedbackSupport)) {
            $this->feedbackSupports->add($feedbackSupport);
            $feedbackSupport->setUserId($this);
        }

        return $this;
    }

    public function removeFeedbackSupport(FeedbackSupport $feedbackSupport): static
    {
        if ($this->feedbackSupports->removeElement($feedbackSupport)) {
            // set the owning side to null (unless already changed)
            if ($feedbackSupport->getUserId() === $this) {
                $feedbackSupport->setUserId(null);
            }
        }

        return $this;
    }
}

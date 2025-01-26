<?php

namespace App\Entity;

use App\Repository\FeedbackSupportRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: FeedbackSupportRepository::class)]
class FeedbackSupport
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?int $user_id = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $feedback = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $submitted_at = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(int $id): static
    {
        $this->id = $id;

        return $this;
    }

    public function getUserId(): ?int
    {
        return $this->user_id;
    }

    public function setUserId(int $user_id): static
    {
        $this->user_id = $user_id;

        return $this;
    }

    public function getFeedback(): ?string
    {
        return $this->feedback;
    }

    public function setFeedback(string $feedback): static
    {
        $this->feedback = $feedback;

        return $this;
    }

    public function getSubmittedAt(): ?\DateTimeImmutable
    {
        return $this->submitted_at;
    }

    public function setSubmittedAt(?\DateTimeImmutable $submitted_at): static
    {
        $this->submitted_at = $submitted_at;

        return $this;
    }
}

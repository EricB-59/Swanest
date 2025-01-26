<?php

namespace App\Entity;

use App\Repository\BlockReportRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: BlockReportRepository::class)]
class BlockReport
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?int $reporter_id = null;

    #[ORM\Column]
    private ?int $reported_id = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $reason = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $reported_at = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(int $id): static
    {
        $this->id = $id;

        return $this;
    }

    public function getReporterId(): ?int
    {
        return $this->reporter_id;
    }

    public function setReporterId(int $reporter_id): static
    {
        $this->reporter_id = $reporter_id;

        return $this;
    }

    public function getReportedId(): ?int
    {
        return $this->reported_id;
    }

    public function setReportedId(int $reported_id): static
    {
        $this->reported_id = $reported_id;

        return $this;
    }

    public function getReason(): ?string
    {
        return $this->reason;
    }

    public function setReason(string $reason): static
    {
        $this->reason = $reason;

        return $this;
    }

    public function getReportedAt(): ?\DateTimeImmutable
    {
        return $this->reported_at;
    }

    public function setReportedAt(\DateTimeImmutable $reported_at): static
    {
        $this->reported_at = $reported_at;

        return $this;
    }
}

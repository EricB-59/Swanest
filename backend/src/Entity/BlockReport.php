<?php

namespace App\Entity;

use App\Repository\BlockReportRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: BlockReportRepository::class)]
#[ORM\Table(name: "block_reports")]
class BlockReport
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'blockReports')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $reporter = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $reported = null;

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

    public function getReporter(): ?User
    {
        return $this->reporter;
    }

    public function setReporter(?User $reporter): static
    {
        $this->reporter = $reporter;

        return $this;
    }

    public function getReported(): ?User
    {
        return $this->reported;
    }

    public function setReported(?User $reported): static
    {
        $this->reported = $reported;

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

    public function toArray(): array
    {
        return [
            'id' => $this->getId(),
            'reporter' => $this->getReporter()?->getId(),
            'reported' => $this->getReported()?->getId(),
            'reason' => $this->getReason(),
            'reported_at' => $this->getReportedAt()?->format('Y-m-d H:i:s'),
        ];
    }
}

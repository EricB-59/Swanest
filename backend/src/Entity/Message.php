<?php

namespace App\Entity;

use App\Repository\MessageRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: MessageRepository::class)]
#[ORM\Table(name: "messages")]
class Message
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'messages')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Chat $chat = null;

    #[ORM\ManyToOne(inversedBy: 'messages')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $sender = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $receiver = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $content = null;

    #[ORM\Column]
    private ?bool $is_read = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $sent_at = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(int $id): static
    {
        $this->id = $id;

        return $this;
    }

    public function getChat(): ?Chat
    {
        return $this->chat;
    }

    public function setChat(?Chat $chat): static
    {
        $this->chat = $chat;

        return $this;
    }

    public function getSender(): ?User
    {
        return $this->sender;
    }

    public function setSender(?User $sender): static
    {
        $this->sender = $sender;

        return $this;
    }

    public function getReceiver(): ?User
    {
        return $this->receiver;
    }

    public function setReceiver(?User $receiver): static
    {
        $this->receiver = $receiver;

        return $this;
    }

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(string $content): static
    {
        $this->content = $content;

        return $this;
    }

    public function isRead(): ?bool
    {
        return $this->is_read;
    }

    public function setIsRead(bool $is_read): static
    {
        $this->is_read = $is_read;

        return $this;
    }

    public function getSentAt(): ?\DateTimeImmutable
    {
        return $this->sent_at;
    }

    public function setSentAt(\DateTimeImmutable $sent_at): static
    {
        $this->sent_at = $sent_at;

        return $this;
    }

    /**
     * Convierte el objeto Message y sus relaciones a un array asociativo
     * 
     * @return array
     */
    public function toArray(): array
    {
        $messageData = [
            'id' => $this->getId(),
            'content' => $this->getContent(),
            'is_read' => $this->isRead(),
            'sent_at' => $this->getSentAt() ? $this->getSentAt()->format('Y-m-d H:i:s') : null,
        ];

        // No incluimos objetos completos para evitar referencias circulares
        // Solo incluimos los IDs
        $messageData['chat_id'] = $this->getChat() ? $this->getChat()->getId() : null;
        $messageData['sender_id'] = $this->getSender() ? $this->getSender()->getId() : null;
        $messageData['receiver_id'] = $this->getReceiver() ? $this->getReceiver()->getId() : null;

        // Opcionalmente, podemos incluir información básica de los usuarios
        if ($this->getSender()) {
            $messageData['sender_username'] = $this->getSender()->getUsername();
        }

        if ($this->getReceiver()) {
            $messageData['receiver_username'] = $this->getReceiver()->getUsername();
        }

        return $messageData;
    }
}

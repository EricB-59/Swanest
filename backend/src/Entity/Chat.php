<?php

namespace App\Entity;

use App\Repository\ChatRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ChatRepository::class)]
#[ORM\Table(name: "chats")]
class Chat
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'chats')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user1 = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user2 = null;

    /**
     * @var Collection<int, Message>
     */
    #[ORM\OneToMany(targetEntity: Message::class, mappedBy: 'chat', orphanRemoval: true)]
    private Collection $messages;

    #[ORM\Column]
    private ?bool $fixed = null;

    public function __construct()
    {
        $this->messages = new ArrayCollection();
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

    public function getUser1(): ?User
    {
        return $this->user1;
    }

    public function setUser1(?User $user1): static
    {
        $this->user1 = $user1;

        return $this;
    }

    public function getUser2(): ?User
    {
        return $this->user2;
    }

    public function setUser2(?User $user2): static
    {
        $this->user2 = $user2;

        return $this;
    }

    /**
     * @return Collection<int, Message>
     */
    public function getMessages(): Collection
    {
        return $this->messages;
    }

    public function addMessage(Message $message): static
    {
        if (!$this->messages->contains($message)) {
            $this->messages->add($message);
            $message->setChat($this);
        }

        return $this;
    }

    public function removeMessage(Message $message): static
    {
        if ($this->messages->removeElement($message)) {
            // set the owning side to null (unless already changed)
            if ($message->getChat() === $this) {
                $message->setChat(null);
            }
        }

        return $this;
    }

    /**
     * Convierte el objeto Chat y sus relaciones a un array asociativo
     * 
     * @return array
     */
    public function toArray(): array
    {
        $chatData = [
            'id' => $this->getId(),
        ];

        // No incluimos los objetos completos de usuario para evitar referencias circulares
        // Solo incluimos los IDs de los usuarios
        $chatData['user1_id'] = $this->getUser1() ? $this->getUser1()->getId() : null;
        $chatData['user2_id'] = $this->getUser2() ? $this->getUser2()->getId() : null;

        // Opcionalmente, podemos incluir información básica de los usuarios
        if ($this->getUser1()) {
            $chatData['user1_username'] = $this->getUser1()->getUsername();
        }

        if ($this->getUser2()) {
            $chatData['user2_username'] = $this->getUser2()->getUsername();
        }

        // Convertir colección de mensajes a array
        $chatData['messages'] = [];
        foreach ($this->getMessages() as $message) {
            $chatData['messages'][] = $message->toArray();
        }

        return $chatData;
    }

    public function isFixed(): ?bool
    {
        return $this->fixed;
    }

    public function setFixed(bool $fixed): static
    {
        $this->fixed = $fixed;

        return $this;
    }
}

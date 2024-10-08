package github.sarthakdev.backend;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MessageController {

    @GetMapping("/")
    public String index() {
        return "redirect:/chat";
    }

    @MessageMapping("/sendMessage")
    @SendTo("/topic/messages")
    public ChatMessage sendMessage(ChatMessage chatMessage) {
        // Log the incoming message for debugging
        System.out.println(
                "\nReceived message: " + chatMessage.getContent() + "\nSent BY : " + chatMessage.getSender() + "\n");
        return chatMessage; // Send the same message back to all subscribed clients
    }
}

package donation.example.donation.system.service.ai;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.util.FileCopyUtils;

import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@Service
public class PromptService {

    private final Map<String, String> promptCache = new HashMap<>();

    public String getPrompt(String promptName) {
        if (promptCache.containsKey(promptName)) {
            return promptCache.get(promptName);
        }

        try {
            ClassPathResource resource = new ClassPathResource("prompts/" + promptName + ".txt");
            InputStreamReader reader = new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8);
            String content = FileCopyUtils.copyToString(reader);
            promptCache.put(promptName, content);
            return content;
        } catch (IOException e) {
            throw new RuntimeException("Failed to load prompt: " + promptName, e);
        }
    }

    public String fillPrompt(String promptName, Map<String, String> variables) {
        String prompt = getPrompt(promptName);

        for (Map.Entry<String, String> entry : variables.entrySet()) {
            prompt = prompt.replace("{{" + entry.getKey() + "}}", entry.getValue());
        }

        return prompt;
    }
}

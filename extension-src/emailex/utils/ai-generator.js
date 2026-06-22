/**
 * AI Content Generation Utilities
 * Handles integration with various AI providers
 * Supports OpenAI, Claude, Cohere, and custom providers
 */

class AIGenerator {
    constructor(config = {}) {
        this.config = config;
        this.apiKey = null;
        this.provider = config.provider || 'template';
    }

    /**
     * Initialize AI generator with API key
     */
    async initialize(apiKey) {
        this.apiKey = apiKey;
        return this.validateConnection();
    }

    /**
     * Validate API connection
     */
    async validateConnection() {
        if (!this.apiKey || this.provider === 'template') {
            return true;
        }

        try {
            const result = await this.makeAPICall('validate');
            return result.success;
        } catch (error) {
            console.error('API validation failed:', error);
            return false;
        }
    }

    /**
     * Generate email content
     */
    async generateEmail(issue, troubleshooting, customerName = 'Valued Customer', username = 'Support Agent') {
        if (this.provider === 'template') {
            return this.generateEmailTemplate(issue, troubleshooting, customerName, username);
        }

        return this.generateEmailWithAI(issue, troubleshooting, customerName, username);
    }

    /**
     * Generate case comment
     */
    async generateCaseComment(issue, troubleshooting) {
        if (this.provider === 'template') {
            return this.generateCaseCommentTemplate(issue, troubleshooting);
        }

        return this.generateCaseCommentWithAI(issue, troubleshooting);
    }

    /**
     * Template-based email generation
     */
    generateEmailTemplate(issue, troubleshooting, customerName, username) {
        const emailBody = this.generateEmailBody(issue, troubleshooting);
        
        return `Dear ${customerName},

This is ${username} from Enphase Technical Support. I hope you are doing well.

I am writing in reference to the following case:

${emailBody}

Please let us know if you have any further questions.

Regards,

${username}
Enphase Technical Support`;
    }

    /**
     * Template-based case comment generation
     */
    generateCaseCommentTemplate(issue, troubleshooting) {
        const troubleshootingSteps = this.formatTroubleshootingSteps(troubleshooting);
        const resolutionSteps = this.inferResolution(issue, troubleshooting);

        return `Query: ${issue}

Previous Case: 

Troubleshooting:
${troubleshootingSteps}

Resolution:
${resolutionSteps}`;
    }

    /**
     * Generate email body with AI
     */
    async generateEmailWithAI(issue, troubleshooting, customerName, username) {
        const prompt = this.buildEmailPrompt(issue, troubleshooting, customerName, username);
        const response = await this.makeAPICall('chat', {
            messages: [{
                role: 'user',
                content: prompt
            }],
            temperature: 0.7,
            maxTokens: 1000
        });

        return response.content;
    }

    /**
     * Generate case comment with AI
     */
    async generateCaseCommentWithAI(issue, troubleshooting) {
        const prompt = this.buildCaseCommentPrompt(issue, troubleshooting);
        const response = await this.makeAPICall('chat', {
            messages: [{
                role: 'user',
                content: prompt
            }],
            temperature: 0.6,
            maxTokens: 800
        });

        return response.content;
    }

    /**
     * Make API call to configured provider
     */
    async makeAPICall(action, payload = {}) {
        if (!this.apiKey) {
            throw new Error('API key not configured');
        }

        switch (this.provider) {
            case 'openai':
                return this.callOpenAI(action, payload);
            case 'claude':
                return this.callClaude(action, payload);
            case 'cohere':
                return this.callCohere(action, payload);
            default:
                throw new Error(`Unsupported provider: ${this.provider}`);
        }
    }

    /**
     * Call OpenAI API
     */
    async callOpenAI(action, payload) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-4',
                messages: payload.messages,
                temperature: payload.temperature || 0.7,
                max_tokens: payload.maxTokens || 1000
            })
        });

        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.statusText}`);
        }

        const data = await response.json();
        return {
            success: true,
            content: data.choices[0].message.content
        };
    }

    /**
     * Call Claude API
     */
    async callClaude(action, payload) {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'x-api-key': this.apiKey,
                'Content-Type': 'application/json',
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-opus-20240229',
                max_tokens: payload.maxTokens || 1000,
                messages: payload.messages
            })
        });

        if (!response.ok) {
            throw new Error(`Claude API error: ${response.statusText}`);
        }

        const data = await response.json();
        return {
            success: true,
            content: data.content[0].text
        };
    }

    /**
     * Call Cohere API
     */
    async callCohere(action, payload) {
        const messageText = payload.messages[0].content;
        
        const response = await fetch('https://api.cohere.com/v1/generate', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: messageText,
                max_tokens: payload.maxTokens || 1000,
                temperature: payload.temperature || 0.7
            })
        });

        if (!response.ok) {
            throw new Error(`Cohere API error: ${response.statusText}`);
        }

        const data = await response.json();
        return {
            success: true,
            content: data.generations[0].text
        };
    }

    /**
     * Build email prompt for AI
     */
    buildEmailPrompt(issue, troubleshooting, customerName, username) {
        return `You are a professional technical support engineer writing a customer email response.

Generate a professional email response to the following customer issue:

**Customer Issue:**
${issue}

**Troubleshooting Steps Already Performed:**
${troubleshooting || 'To be inferred from the issue'}

**Customer Name:** ${customerName}
**Support Engineer:** ${username}

Please generate the email body (between the greeting and closing) that:
1. Acknowledges the issue
2. Explains the root cause
3. Provides clear troubleshooting steps
4. Offers next steps
5. Is professional and empathetic

Format the response as a clear, well-structured email body suitable for a technical support email.`;
    }

    /**
     * Build case comment prompt for AI
     */
    buildCaseCommentPrompt(issue, troubleshooting) {
        return `You are a technical support engineer documenting a case in Salesforce.

**Issue:** ${issue}

**Troubleshooting Performed:** ${troubleshooting}

Generate a structured case comment with:
1. Clear troubleshooting steps (as bullet points)
2. Analysis of the issue
3. Recommended resolution
4. Next steps for the customer

Format with sections:
- Troubleshooting:
- Analysis:
- Resolution:
- Next Steps:`;
    }

    /**
     * Generate email body
     */
    generateEmailBody(issue, troubleshooting) {
        const analysis = this.analyzeIssue(issue);
        const steps = troubleshooting || this.inferTroubleshootingSteps(issue);
        const resolution = this.inferResolution(issue, troubleshooting);

        return `**Issue Summary:**
${analysis}

**Steps Taken:**
${steps}

${resolution ? `**Recommended Solution:**
${resolution}` : ''}`;
    }

    /**
     * Analyze customer issue
     */
    analyzeIssue(issue) {
        const lowerIssue = issue.toLowerCase();
        let analysis = '';

        if (lowerIssue.includes('underproduct')) {
            analysis = 'Your system is experiencing reduced production output. This is typically caused by inverter issues, communication loss, or environmental factors (shading/weather).';
        } else if (lowerIssue.includes('error') || lowerIssue.includes('fault')) {
            analysis = 'Your system has detected a fault condition that requires attention. This could be hardware-related or a communication issue.';
        } else if (lowerIssue.includes('communication')) {
            analysis = 'There is a communication or connectivity issue between system components. This may affect system monitoring and control.';
        } else {
            analysis = `Based on your description: ${issue.substring(0, 100)}...`;
        }

        return analysis;
    }

    /**
     * Infer troubleshooting steps
     */
    inferTroubleshootingSteps(issue) {
        const lowerIssue = issue.toLowerCase();
        let steps = [];

        if (lowerIssue.includes('underproduct')) {
            steps = [
                'Check inverter status and LED indicators',
                'Verify all DC and AC connections',
                'Review weather conditions',
                'Check system logs for errors',
                'Perform system restart if needed'
            ];
        } else if (lowerIssue.includes('error')) {
            steps = [
                'Note the error code',
                'Check system logs',
                'Verify hardware connections',
                'Clear transient faults',
                'Monitor for recurrence'
            ];
        } else if (lowerIssue.includes('communication')) {
            steps = [
                'Check network connectivity',
                'Verify Wi-Fi/Ethernet connection',
                'Restart communication devices',
                'Check firewall rules',
                'Verify DNS settings'
            ];
        } else {
            steps = [
                'Review system logs',
                'Verify all connections',
                'Restart affected devices',
                'Monitor system performance'
            ];
        }

        return steps.map(s => `- ${s}`).join('\n');
    }

    /**
     * Format troubleshooting steps
     */
    formatTroubleshootingSteps(troubleshooting) {
        if (!troubleshooting || troubleshooting.trim().length === 0) {
            return '- Pending customer response or further investigation';
        }

        return troubleshooting
            .split('\n')
            .map(step => step.trim())
            .filter(step => step.length > 0)
            .map(step => step.startsWith('-') || step.startsWith('•') ? step : `- ${step}`)
            .join('\n');
    }

    /**
     * Infer resolution
     */
    inferResolution(issue, troubleshooting) {
        return `- Follow troubleshooting steps above
- Monitor system performance for 24-48 hours
- Review system metrics to confirm issue resolution
- Contact support if the issue persists`;
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIGenerator;
}

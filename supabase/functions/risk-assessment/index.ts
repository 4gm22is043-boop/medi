import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RiskAssessmentRequest {
  medicalHistory: {
    pastConditions?: string[];
    surgeries?: string[];
    familyHistory?: string[];
    medications?: string[];
  };
  lifestyle: {
    exercise?: string;
    diet?: string;
    smoking?: boolean;
    alcohol?: string;
    sleepHours?: number;
    stressLevel?: string;
  };
  vitals: {
    heartRate?: number;
    bloodPressure?: string;
    temperature?: number;
    oxygenLevel?: number;
    glucose?: number;
    weight?: number;
    bmi?: number;
  };
  demographics: {
    age?: number;
    gender?: string;
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const requestData: RiskAssessmentRequest = await req.json();

    const groqApiKey = Deno.env.get("GROQ_API_KEY");

    if (!groqApiKey) {
      return new Response(
        JSON.stringify({ error: "GROQ_API_KEY not configured" }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const prompt = `You are a medical AI assistant performing a comprehensive health risk assessment. Analyze the following patient data:

MEDICAL HISTORY:
- Past Conditions: ${requestData.medicalHistory?.pastConditions?.join(", ") || "None reported"}
- Surgeries: ${requestData.medicalHistory?.surgeries?.join(", ") || "None reported"}
- Family History: ${requestData.medicalHistory?.familyHistory?.join(", ") || "None reported"}
- Current Medications: ${requestData.medicalHistory?.medications?.join(", ") || "None"}

LIFESTYLE:
- Exercise: ${requestData.lifestyle?.exercise || "Not specified"}
- Diet: ${requestData.lifestyle?.diet || "Not specified"}
- Smoking: ${requestData.lifestyle?.smoking ? "Yes" : "No"}
- Alcohol: ${requestData.lifestyle?.alcohol || "None"}
- Sleep: ${requestData.lifestyle?.sleepHours || "Not specified"} hours
- Stress Level: ${requestData.lifestyle?.stressLevel || "Not specified"}

CURRENT VITALS:
- Heart Rate: ${requestData.vitals?.heartRate || "Not measured"} BPM
- Blood Pressure: ${requestData.vitals?.bloodPressure || "Not measured"}
- Temperature: ${requestData.vitals?.temperature || "Not measured"}°C
- Oxygen Level: ${requestData.vitals?.oxygenLevel || "Not measured"}%
- Glucose: ${requestData.vitals?.glucose || "Not measured"} mg/dL
- Weight: ${requestData.vitals?.weight || "Not measured"} kg
- BMI: ${requestData.vitals?.bmi || "Not calculated"}

DEMOGRAPHICS:
- Age: ${requestData.demographics?.age || "Not specified"}
- Gender: ${requestData.demographics?.gender || "Not specified"}

Based on this comprehensive data, provide:
1. A risk score from 0-100 (where 0 is lowest risk, 100 is highest risk)
2. Risk level classification (Low, Medium, High)
3. Detailed analysis explaining the risk factors
4. Specific health concerns to monitor
5. Actionable recommendations for improvement

IMPORTANT: Format your response as valid JSON with this exact structure:
{
  "riskScore": 45,
  "riskLevel": "Low/Medium/High",
  "analysis": "Detailed explanation of the risk assessment",
  "concerns": ["Concern 1", "Concern 2"],
  "recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"]
}

Provide only the JSON response, no additional text.`;

    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${groqApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are a medical AI assistant specialized in health risk assessment. Always respond with valid JSON only."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.error("Groq API error:", errorText);
      return new Response(
        JSON.stringify({ error: "AI service temporarily unavailable" }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const groqData = await groqResponse.json();
    const aiResponse = groqData.choices[0]?.message?.content || "{}";

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(aiResponse);
    } catch (e) {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0]);
      } else {
        parsedResponse = {
          riskScore: 50,
          riskLevel: "Medium",
          analysis: aiResponse,
          concerns: [],
          recommendations: []
        };
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: parsedResponse,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error in risk-assessment:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error.message
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});

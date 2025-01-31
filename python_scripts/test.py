# flake8: noqa
from pprint import pprint
from typing import List

import jsonref
from pydantic import BaseModel, Field
from vertexai.generative_models import GenerationConfig, GenerativeModel

# from src.llm_framework.llm.config import LLMModelConfig, ModelType
# from src.llm_framework.llm.model import LLMModel
# from src.llm_framework.tools.tool_manager import ToolManager
# from src.llm_tools.cmp import update_task_content
# from src.services.tools.models import LocalTool

# tool_manager = ToolManager()
# tool_manager.register_tools([LocalTool.from_function(update_task_content)])

# pprint(tool_manager.get_tool("update_task_content").function_declaration.parameters)


# class FormattedFunctionCallResponse(TypedDict):
#     function_name: str
#     params: dict


# def _get_formatted_response_from_malformed_function_call(
#     malformed_function_call_error: str,
# ) -> FormattedFunctionCallResponse:
#     PROJECT_ID = "opal-backend-inte-mysj"
#     vertexai.init(project=PROJECT_ID, location="us-central1")
#     config = LLMModelConfig(
#         model_name=ModelType.GEMINI_2_0_FLASH_EXP,
#         stream=False,
#         max_tokens=8192,
#         default_temperature=0,
#     )
#     try:
#         model = LLMModel(config)
#         response_schema = {"function_name": str, "parameters": dict}
#         prompt = f"""
#                 You are an Expert function parameter extractor tool.
#                 Extract out the parameters from the following.
#                 ```
#                 {malformed_function_call_error}
#                 ```
#             """
#         response = model.generate_content(
#             contents=[
#                 Content(
#                     role="user",
#                     parts=[Part.from_text(prompt)],
#                 )
#             ],
#             stream=False,
#             generation_config=GenerationConfig(response_mime_type="application/json", response_schema=response_schema),
#         )
#         if not isinstance(response, GenerationResponse):
#             raise TypeError("Not expecting streaming response")
#     except Exception as e:
#         raise Exception(f"Error generating response from malformed function call: {e}")
#     try:
#         return json.loads(response.text.replace("\n", "").replace("'", '"'))
#     except Exception as e:
#         raise Exception(f"Error parsing response from malformed function call: {e}")


# function_error_str = "Malformed function call: print(update_task_content(content_id='e490c01001274501b25f784b41671407', fields=[{'field_x_path': 'e490c01001274501b25f784b41671407.body.bn.0', 'field_key': 'body', 'field_value': '<h1>Social Media Campaign for Optimizely CMP (Gen Z Focus)</h1>\n<p>This campaign is designed to connect with Generation Z (born 1997-2012) on social media platforms they frequent.</p>\n<p><b>Objective:</b> Drive adoption of Optimizely's Content Marketing Platform (CMP) among Gen Z professionals.</p>\n<p><b>Target Audience:</b> Gen Z content creators, marketers, and decision-makers.</p>\n<p><b>Platforms:</b> TikTok, Instagram, YouTube, and Twitter.</p>\n<p><b>Strategy:</b></p>\n<ul><li><b>Content Pillars:</b> Focus on creativity, authenticity, and social impact. Highlight how Optimizely CMP empowers users to create unique and engaging content that resonates with their target audience.  Emphasize mobile-first design, ease of use, and quick results.</li><li><b>Content Types:</b> Create short-form videos, engaging visuals, and interactive content. Leverage user-generated content and influencer marketing. Run contests and challenges to encourage participation.</li><li><b>Paid Advertising:</b> Utilize targeted advertising on platforms frequented by Gen Z. A/B test ad creatives to optimize performance.</li><li><b>Community Engagement:</b> Actively participate in relevant online communities and discussions.  Respond to comments and messages promptly.  Partner with relevant influencers to amplify reach.</li></ul>\n<p><b>Metrics:</b> Track impressions, reach, engagement (likes, shares, comments, saves), website clicks, lead generation, and cost per lead. Regularly analyze data to optimize campaign performance.</p>\n<p><b>Timeline:</b> Align with the overall campaign timeline. Establish clear deadlines for content creation, ad scheduling, and performance analysis.</p>\n<p><b>Deliverables:</b> Regular reports detailing campaign performance, including key metrics and insights. Recommendations for optimization based on data analysis.</p>', 'field_type': 'rich-text', 'is_core_attribute': False, 'order_index': 0}], locale='bn', org_sso_id='5d75447b7f1c1c000957d362', task_id='679ef38439c248babc9127c2', user_id='679cdc0691b9dd759a819820')"

# _get_formatted_response_from_malformed_function_call(function_error_str)


# response_schema = {
#     "type": "object",
#     "properties": {
#         "function_name": {"type": "string", "description": "The name of the function to call"},
#         "parameters": {"type": "string", "description": "The parameters to pass to the function in JSON Stringified format"}
#     }
# }


class Parameter(BaseModel):
    name: str = Field(description="The name of the parameter")
    value: str = Field(description="The value of the parameter")


class Response(BaseModel):
    function_name: str = Field(description="The name of the function to call")
    parameters: List[Parameter] = Field(description="The parameters to pass to the function")


response_schema = jsonref.replace_refs(Response.model_json_schema(), lazy_load=False)
del response_schema["$defs"]
# print(response_schema)
# response_schema = {
#     "type": "OBJECT",
#     "properties": {
#         "forecast": {
#             "type": "ARRAY",
#             "items": {
#                 "type": "OBJECT",
#                 "properties": {
#                     "Day": {"type": "STRING", "nullable": True},
#                     "Forecast": {"type": "STRING", "nullable": True},
#                     "Temperature": {"type": "INTEGER", "nullable": True},
#                     "Humidity": {"type": "STRING", "nullable": True},
#                     "Wind Speed": {"type": "INTEGER", "nullable": True},
#                 },
#                 "required": ["Day", "Temperature", "Forecast", "Wind Speed"],
#             },
#         }
#     },
# }

# prompt = """
#     The week ahead brings a mix of weather conditions.
#     Sunday is expected to be sunny with a temperature of 77°F and a humidity level of 50%. Winds will be light at around 10 km/h.
#     Monday will see partly cloudy skies with a slightly cooler temperature of 72°F and the winds will pick up slightly to around 15 km/h.
#     Tuesday brings rain showers, with temperatures dropping to 64°F and humidity rising to 70%.
#     Wednesday may see thunderstorms, with a temperature of 68°F.
#     Thursday will be cloudy with a temperature of 66°F and moderate humidity at 60%.
#     Friday returns to partly cloudy conditions, with a temperature of 73°F and the Winds will be light at 12 km/h.
#     Finally, Saturday rounds off the week with sunny skies, a temperature of 80°F, and a humidity level of 40%. Winds will be gentle at 8 km/h.
# """

malformed_function_call_error = "Malformed function call: print(update_task_content(content_id='e490c01001274501b25f784b41671407', fields=[{'field_x_path': 'e490c01001274501b25f784b41671407.body.bn.0', 'field_key': 'body', 'field_value': '<h1>Social Media Campaign for Optimizely CMP (Gen Z Focus)</h1>\n<p>This campaign is designed to connect with Generation Z (born 1997-2012) on social media platforms they frequent.</p>\n<p><b>Objective:</b> Drive adoption of Optimizely's Content Marketing Platform (CMP) among Gen Z professionals.</p>\n<p><b>Target Audience:</b> Gen Z content creators, marketers, and decision-makers.</p>\n<p><b>Platforms:</b> TikTok, Instagram, YouTube, and Twitter.</p>\n<p><b>Strategy:</b></p>\n<ul><li><b>Content Pillars:</b> Focus on creativity, authenticity, and social impact. Highlight how Optimizely CMP empowers users to create unique and engaging content that resonates with their target audience.  Emphasize mobile-first design, ease of use, and quick results.</li><li><b>Content Types:</b> Create short-form videos, engaging visuals, and interactive content. Leverage user-generated content and influencer marketing. Run contests and challenges to encourage participation.</li><li><b>Paid Advertising:</b> Utilize targeted advertising on platforms frequented by Gen Z. A/B test ad creatives to optimize performance.</li><li><b>Community Engagement:</b> Actively participate in relevant online communities and discussions.  Respond to comments and messages promptly.  Partner with relevant influencers to amplify reach.</li></ul>\n<p><b>Metrics:</b> Track impressions, reach, engagement (likes, shares, comments, saves), website clicks, lead generation, and cost per lead. Regularly analyze data to optimize campaign performance.</p>\n<p><b>Timeline:</b> Align with the overall campaign timeline. Establish clear deadlines for content creation, ad scheduling, and performance analysis.</p>\n<p><b>Deliverables:</b> Regular reports detailing campaign performance, including key metrics and insights. Recommendations for optimization based on data analysis.</p>', 'field_type': 'rich-text', 'is_core_attribute': False, 'order_index': 0}], locale='bn', org_sso_id='5d75447b7f1c1c000957d362', task_id='679ef38439c248babc9127c2', user_id='679cdc0691b9dd759a819820')"

prompt = f"""
You are an Expert function parameter extractor tool.
Extract out the parameters from the following.
```
{malformed_function_call_error}
```
"""

model = GenerativeModel("gemini-2.0-flash-001")

response = model.generate_content(
    prompt,
    generation_config=GenerationConfig(response_mime_type="application/json", response_schema=response_schema),
)
pprint(response.text)

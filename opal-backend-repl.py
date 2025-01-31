from main import init_vertexai
from src.services.instructions.service import InstructionService
from src.services.instructions.repository import (
    SystemPromptRepository,
    UserInstructionRepository,
)
from src.database.connection import get_client


init_vertexai()
spanner_client = get_client()
system_prompt_repo = SystemPromptRepository(client=spanner_client)
user_instruction_repo = UserInstructionRepository(client=spanner_client)
instruction_service = InstructionService(system_prompt_repo, user_instruction_repo)

query = 'how are you today'
customer_id = '1569112c-63f9-4997-8b0e-d023e413ef00'

await instruction_service.get_related_instructions(query, customer_id)

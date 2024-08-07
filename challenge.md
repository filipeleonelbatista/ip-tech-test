# Registro de Atendimento

A clínica ACME deseja ter uma solução web para registrar os atendimentos realizados com seus pacientes. Para isso, está pedindo um site que possibilite o cadastramento dos pacientes e o registro dos atendimentos de cada paciente.

A solução deve ser dividida em duas partes:

1. **Cadastro de Pacientes**: Campos para nome, data de nascimento, CPF, sexo, endereço e status.
2. **Registro de Atendimento**: Seleção do paciente, data e hora, e descrição do atendimento.

Deve ser possível pesquisar os pacientes por nome ou CPF, bem como listar os atendimentos por paciente.

## Cadastro de Pacientes

O cadastro de pacientes deve possuir as seguintes informações:

- Nome (obrigatório)
- Data de nascimento (obrigatório)
- CPF (obrigatório)
- Sexo (obrigatório)
- Endereço Completo (CEP, cidade, bairro, endereço e complemento - opcional)
- Status (obrigatório – Ativo/Inativo)

O sistema deve validar para não permitir CPF duplicado.

### Requisitos:

- Listar pacientes, com opção de filtro pelo nome, CPF e Status;
- Cadastrar e editar paciente;
- Inativar pacientes;

## Registro de Atendimento

O registro de atendimentos deve possuir as seguintes informações:

- Paciente (obrigatório)
- Data e Hora (obrigatório)
- Descrição do atendimento (obrigatório)
- Status (obrigatório – Ativo/Inativo)

O sistema deve validar para não permitir registros com data e hora no futuro, apenas registros até a data e hora atual.

### Requisitos:

- Possibilitar a consulta de paciente, mostrando apenas pacientes ativos (Status ativo);
- Cadastrar e editar registros de atendimento;
- A descrição deve permitir textos grandes com quebra de linha;
- Inativar registros;
- Listar atendimentos com filtro por data (período), paciente e status;

## Forma de Envio

Enviar link do repositório no GitHub, Bitbucket, GitLab, etc.

## O que Iremos Avaliar

- **Funcionalidades**: Atender os requisitos do enunciado;
- **Organização do código**:
  - Separação de responsabilidades
  - Facilidade de leitura/entendimento
  - Organização de pastas
  - Semântica do código
- **Conhecimento do framework**: Utilização correta das funcionalidades e conceitos do framework escolhido para o desenvolvimento do sistema;
- **Conhecimento Web**: Marcação HTML, estilos, JavaScript/TypeScript;
- **Conhecimento de git**: Padronização dos commits.

## Opcionais

- Testes unitários
- Utilização de interfaces
- Utilização de design patterns

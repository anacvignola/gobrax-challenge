export const formatCPF = (value: string) => {
  const cpf = value.replace(/\D/g, ''); // Remove caracteres não numéricos do CPF
  if (cpf.length <= 3) {
    return cpf;
  } else if (cpf.length <= 6) {
    return cpf.replace(/^(\d{3})(\d{0,3})/, '$1.$2');
  } else if (cpf.length <= 9) {
    return cpf.replace(/^(\d{3})(\d{3})(\d{0,3})/, '$1.$2.$3');
  } else {
    return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4');
  }
};
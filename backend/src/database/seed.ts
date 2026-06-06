import { DataSource } from 'typeorm';
import { Form } from '../entities/form.entity';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export async function seedDatabase(dataSource: DataSource) {
  const formRepository = dataSource.getRepository(Form);
  const userRepository = dataSource.getRepository(User);

  // Seed de formularios
  const forms = [
    { formNumber: 1, title: 'Informe Policial Homologado (IPH2019)', description: 'Formulario principal', orderIndex: 1 },
    { formNumber: 2, title: 'Sección 2: Primer Respondiente', description: 'Datos del primer respondiente', orderIndex: 2 },
    { formNumber: 3, title: 'Apartado 4.2: Inspección del lugar', description: 'Inspección con croquis', orderIndex: 3 },
    { formNumber: 4, title: 'Sección 5: Narrativa de los Hechos', description: 'Narrativa detallada', orderIndex: 4 },
    { formNumber: 5, title: 'Anexo A: Detención(es)', description: 'Datos de detención', orderIndex: 5 },
    { formNumber: 6, title: 'Anexo A: Detención(es) - Continuación', description: 'Continuación detención', orderIndex: 6 },
    { formNumber: 7, title: 'Anexo A: Apartados 7 y 8', description: 'Apartados adicionales', orderIndex: 7 },
    { formNumber: 8, title: 'Anexo B', description: 'Anexo B', orderIndex: 8 },
    { formNumber: 9, title: 'Anexo C', description: 'Anexo C', orderIndex: 9 },
    { formNumber: 10, title: 'Anexo D: Inventario de Armas y Objetos', description: 'Inventario', orderIndex: 10 },
    { formNumber: 11, title: 'Anexo E', description: 'Anexo E', orderIndex: 11 },
    { formNumber: 12, title: 'Anexo E: Entrevistas', description: 'Entrevistas', orderIndex: 12 },
    { formNumber: 13, title: 'Anexo F', description: 'Anexo F', orderIndex: 13 },
    { formNumber: 14, title: 'Anexo F: Preservación del Lugar', description: 'Preservación', orderIndex: 14 },
    { formNumber: 15, title: 'Anexo G: Continuación de la Narrativa', description: 'Continuación narrativa', orderIndex: 15 },
  ];

  for (const formData of forms) {
    const existing = await formRepository.findOne({ where: { formNumber: formData.formNumber } });
    if (!existing) {
      const form = formRepository.create(formData);
      await formRepository.save(form);
      console.log(`✅ Formulario ${formData.formNumber} creado`);
    }
  }

  // Seed de usuario admin
  const adminExists = await userRepository.findOne({ where: { username: 'admin' } });
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = userRepository.create({
      id: uuidv4(),
      username: 'admin',
      password_hash: hashedPassword,
      fullName: 'Administrador',
      role: 'admin',
      isActive: true,
    });
    await userRepository.save(admin);
    console.log('✅ Usuario admin creado (username: admin, password: admin123)');
  }

  console.log('🎉 Seed completado');
}

import { supabase, User, Company, Job, Application, Review, ContactMessage } from '../utils/supabase.ts';

// Service Utilisateur (Étudiant)
export const userService = {
  // Inscription étudiant
  async register(userData: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    university?: string;
    level?: string;
    field?: string;
  }) {
    const { data, error } = await supabase
      .from('users')
      .insert([{
        ...userData,
        password_hash: userData.password, // En production, hasher le mot de passe
        account_status: 'active'
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Connexion étudiant
  async login(email: string, password: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('password_hash', password)
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error('Email ou mot de passe incorrect.');
    return data;
  },

  // Récupérer un utilisateur par ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Mettre à jour un utilisateur
  async update(id: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// Service Entreprise
export const companyService = {
  // Inscription entreprise
  async register(companyData: {
    name: string;
    contact_name?: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
    sector?: string;
    size?: string;
  }) {
    const { data, error } = await supabase
      .from('companies')
      .insert([{
        ...companyData,
        password_hash: companyData.password,
        account_status: 'active',
        is_connected: false
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Connexion entreprise
  async login(email: string, password: string) {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('email', email)
      .eq('password_hash', password)
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error('Email ou mot de passe incorrect.');
    return data;
  },

  // Récupérer toutes les entreprises
  async getAll() {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Récupérer une entreprise par ID
  async getById(id: number) {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Mettre à jour une entreprise
  async update(id: number, updates: Partial<Company>) {
    const { data, error } = await supabase
      .from('companies')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Récupérer les statistiques d'une entreprise
  async getCompanyStats(companyId: number) {
    // Compter les offres d'emploi
    const { count: jobsCount, error: jobsError } = await supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', companyId);

    if (jobsError) throw jobsError;

    // Compter les candidatures
    const { count: applicationsCount, error: applicationsError } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', companyId);

    if (applicationsError) throw applicationsError;

    return {
      jobs: jobsCount || 0,
      applications: applicationsCount || 0,
      views: 0 // TODO: Implémenter les vues si nécessaire
    };
  }
};

// Service Offres d'emploi
export const jobService = {
  // Récupérer toutes les offres
  async getAll() {
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        companies (
          name,
          logo_url
        )
      `)
      .order('posted_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Récupérer les offres d'une entreprise
  async getByCompanyId(companyId: number) {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('company_id', companyId)
      .order('posted_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Récupérer une offre par ID
  async getById(id: number) {
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        companies (
          name,
          logo_url
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Créer une offre
  async create(jobData: Omit<Job, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('jobs')
      .insert([jobData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Mettre à jour une offre
  async update(id: number, updates: Partial<Job>) {
    const { data, error } = await supabase
      .from('jobs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Supprimer une offre
  async delete(id: number) {
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// Service Candidatures
export const applicationService = {
  // Récupérer les candidatures d'une entreprise
  async getByCompanyId(companyId: number) {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        jobs (
          title,
          companies (
            name
          )
        ),
        users (
          first_name,
          last_name,
          email
        )
      `)
      .eq('jobs.company_id', companyId)
      .order('applied_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Récupérer les candidatures d'un étudiant
  async getByStudentId(studentId: string) {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        jobs (
          title,
          location,
          companies (
            name,
            logo_url
          )
        )
      `)
      .eq('student_id', studentId)
      .order('applied_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Postuler à une offre avec upload de CV
  async createWithCV(applicationData: Omit<Application, 'id' | 'applied_at'>, cvFile: File) {
    try {
      // Upload du CV vers Supabase Storage
      const fileName = `cv_${Date.now()}_${cvFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(`cvs/${fileName}`, cvFile);

      if (uploadError) throw uploadError;

      // Créer l'application avec l'URL du CV
      const cvUrl = uploadData.path;
      const { data, error } = await supabase
        .from('applications')
        .insert([{
          ...applicationData,
          cv_url: cvUrl
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de la création de la candidature:', error);
      throw error;
    }
  },

  // Mettre à jour le statut d'une candidature
  async updateStatus(applicationId: number, status: string) {
    const { data, error } = await supabase
      .from('applications')
      .update({ status })
      .eq('id', applicationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// Service Avis
export const reviewService = {
  // Récupérer tous les avis
  async getAll() {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        users (
          first_name,
          last_name
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Créer un avis
  async create(reviewData: Omit<Review, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('reviews')
      .insert([reviewData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Mettre à jour un avis
  async update(id: number, updates: Partial<Review>) {
    const { data, error } = await supabase
      .from('reviews')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Supprimer un avis
  async delete(id: number) {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// Service Messages de contact
export const contactService = {
  // Envoyer un message de contact
  async sendMessage(messageData: Omit<ContactMessage, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([messageData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Récupérer tous les messages (admin seulement)
  async getAll() {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Supprimer un message (admin seulement)
  async delete(id: number) {
    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// Service Admin (utilise la table users avec un rôle spécial)
export const adminService = {
  // Vérifier si c'est un admin (email spécifique)
  async login(email: string, password: string) {
    if (email !== 'admin@careerconnect.fr') {
      throw new Error('Email ou mot de passe incorrect.');
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('password_hash', password)
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error('Email ou mot de passe incorrect.');
    return data;
  },

  // Récupérer les statistiques
  async getStats() {
    const [usersResult, companiesResult, jobsResult, messagesResult, reviewsResult] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('companies').select('*', { count: 'exact', head: true }),
      supabase.from('jobs').select('*', { count: 'exact', head: true }),
      supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
      supabase.from('reviews').select('*', { count: 'exact', head: true })
    ]);

    return {
      students: usersResult.count || 0,
      companies: companiesResult.count || 0,
      jobs: jobsResult.count || 0,
      messages: messagesResult.count || 0,
      reviews: reviewsResult.count || 0
    };
  },

  // Récupérer tous les utilisateurs
  async getAllUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Changer le statut d'un utilisateur
  async updateUserStatus(userId: string, status: string) {
    const { data, error } = await supabase
      .from('users')
      .update({ account_status: status })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// Service Offres Sauvegardées
export const savedJobsService = {
  // Sauvegarder une offre
  async saveJob(studentId: string, jobId: number) {
    const { data, error } = await supabase
      .from('saved_jobs')
      .insert([{
        student_id: studentId,
        job_id: jobId,
        saved_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Récupérer les offres sauvegardées d'un étudiant
  async getByStudentId(studentId: string) {
    const { data, error } = await supabase
      .from('saved_jobs')
      .select(`
        id,
        saved_at,
        jobs (
          id,
          title,
          company,
          location,
          type,
          salary_min,
          salary_max,
          description,
          requirements,
          benefits,
          created_at,
          updated_at,
          status,
          company_id,
          companies (
            id,
            name,
            logo_url,
            sector,
            size,
            website_url,
            description
          )
        )
      `)
      .eq('student_id', studentId)
      .order('saved_at', { ascending: false });

    if (error) throw error;
    return data.map(item => ({
      ...item.jobs,
      saved_at: item.saved_at
    }));
  },

  // Supprimer une offre sauvegardée
  async removeSavedJob(studentId: string, jobId: number) {
    const { error } = await supabase
      .from('saved_jobs')
      .delete()
      .eq('student_id', studentId)
      .eq('job_id', jobId);

    if (error) throw error;
    return true;
  },

  // Vérifier si une offre est sauvegardée
  async isJobSaved(studentId: string, jobId: number) {
    const { data, error } = await supabase
      .from('saved_jobs')
      .select('id')
      .eq('student_id', studentId)
      .eq('job_id', jobId)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  }
};
import React, { useState, useEffect, useRef } from 'react';
import { getAllUsers, createUser, updateUser, deleteUser } from '../../services/users/UserService';
import type { UserCreateOrEdit } from './User';
import { UserRole } from './User';
import './GestionUtilisateur.css';


interface GestionUtilisateurProps {
    onUserAdded: (user: UserCreateOrEdit) => void;
}

interface PaginatedResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: UserCreateOrEdit[];
}

const GestionUtilisateur: React.FC<GestionUtilisateurProps> = ({ onUserAdded }) => {
    // const { profile_id } = useParams();
    const [users, setUsers] = useState<UserCreateOrEdit[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const [nextPage, setNextPage] = useState<string | null>(null);
    const [previousPage, setPreviousPage] = useState<string | null>(null);
    const usersPerPage = 5;
    const [newUser, setNewUser] = useState<UserCreateOrEdit>({
        role: UserRole.GESTIONNAIRE,
        telephone: '',
        username: '',
        email: '',
        password: '',
        first_name: '',
        last_name: '',
    });
    const [editingUser, setEditingUser] = useState<UserCreateOrEdit | null>(null);
    const selectAllRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchUsers();
    }, [currentPage]);

    const fetchUsers = async () => {
        try {
            const data_users = await getAllUsers(currentPage);
            if (data_users && 'results' in data_users) {
                const paginatedData = data_users as PaginatedResponse;
                setUsers(paginatedData.results);
                setTotalUsers(paginatedData.count);
                setNextPage(paginatedData.next);
                setPreviousPage(paginatedData.previous);
            } else {
                console.error('Format de réponse invalide:', data_users);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des utilisateurs:', error);
        }
    };

    const handleUserChange = (field: keyof UserCreateOrEdit, value: string) => {
        if (editingUser) {
            setEditingUser({ ...editingUser, [field]: value });
        } else {
            setNewUser({ ...newUser, [field]: value });
        }
    };

    const handleAddUser = async () => {
        try {
            const response = await createUser(newUser);
            console.log(response);
            onUserAdded(response.data);
            // Reset avec la valeur par défaut pour le rôle
            setNewUser({
                role: UserRole.GESTIONNAIRE,
                telephone: '',
                username: '',
                email: '',
                password: '',
                first_name: '',
                last_name: '',
            });
            fetchUsers();
        } catch (error) {
            console.error('Erreur lors de la création de l\'utilisateur:', error);
        }
    };

    // Correction : utiliser l'ID de l'utilisateur en cours d'édition
    const handleEditUser = async () => {
        if (!editingUser || !editingUser.profile_id) return;
        try {
            await updateUser(editingUser.profile_id, editingUser);
            console.log(editingUser);
            setEditingUser(null);
            fetchUsers();
        } catch (error) {
            console.error('Erreur lors de la modification de l\'utilisateur:', error);
        }
    };

    const handleDeleteUser = async (userId: number) => {
        try {
            await deleteUser(userId);
            fetchUsers();
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'utilisateur:', error);
        }
    };

    const handleDeleteSelected = async () => {
        try {
            await Promise.all(selectedUsers.map(id => deleteUser(id)));
            setSelectedUsers([]);
            fetchUsers();
        } catch (error) {
            console.error('Erreur lors de la suppression des utilisateurs:', error);
        }
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedUsers(users.map(user => user.profile_id).filter((id): id is number => id !== undefined));
        } else {
            setSelectedUsers([]);
        }
    };

    const handleSelectUser = (userId: number, checked: boolean) => {
        if (checked) {
            setSelectedUsers([...selectedUsers, userId]);
        } else {
            setSelectedUsers(selectedUsers.filter(id => id !== userId));
        }
    };

    // Update select all checkbox when individual selections change
    useEffect(() => {
        if (selectAllRef.current) {
            selectAllRef.current.checked = selectedUsers.length === users.length;
            selectAllRef.current.indeterminate = selectedUsers.length > 0 && selectedUsers.length < users.length;
        }
    }, [selectedUsers, users]);

    const totalPages = Math.ceil(totalUsers / usersPerPage);

    return (
        <div className="container">
            <div className="table-wrapper">
                <div className="table-title">
                    <div className="row">
                    <div className="col-sm-2">
        <a href='/users'><i className="material-icons" style={{fontSize: '28px', cursor: 'pointer'}}>&#xE88A;</i></a>
    </div>

    <div className="col-sm-4">
        <h2 className="mb-0">Gestion des <b>Utilisateurs</b></h2>
    </div>
    
    <div className="col-sm-6 text-end">
        <button className="btn btn-success me-2" data-bs-toggle="modal" data-bs-target="#addUserModal">
            <i className="material-icons">&#xE147;</i> <span>Ajouter un utilisateur</span>
        </button>
        {selectedUsers.length > 0 && (
            <button className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteMultipleUserModal">
                <i className="material-icons">&#xE15C;</i> <span>Supprimer la sélection</span>
            </button>
        )}
    </div>
                    </div>
                </div>
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>
                                <span className="custom-checkbox">
                                    <input
                                        type="checkbox"
                                        id="selectAll"
                                        ref={selectAllRef}
                                        onChange={(e) => handleSelectAll(e.target.checked)}
                                    />
                                    <label htmlFor="selectAll"></label>
                                </span>
                            </th>
                            <th>username</th>
                            <th>Prenom</th>
                            <th>Nom</th>
                            <th>Email</th>
                            <th>Téléphone</th>
                            <th>Rôle</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.profile_id}>
                                <td>
                                    <span className="custom-checkbox">
                                        <input
                                            type="checkbox"
                                            id={`checkbox${user.profile_id ?? ''}`}
                                            checked={selectedUsers.includes(user.profile_id ?? -1)} 
                                            onChange={(e) => handleSelectUser(user.profile_id ?? -1, e.target.checked)}
                                        />
                                        <label htmlFor={`checkbox${user.profile_id ?? ''}`}></label>
                                    </span>
                                </td>
                                <td>{user.username}</td>
                                <td>{user.first_name}</td>
                                <td>{user.last_name}</td>
                                <td>{user.email}</td>
                                <td>{user.telephone}</td>
                                <td>{user.role}</td>
                                <td>
                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={() => setEditingUser(user)}
                                        data-bs-toggle="modal"
                                        data-bs-target="#editUserModal"
                                    >
                                        <i className="material-icons">&#xE254;</i>
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDeleteUser(user.profile_id ?? -1)}
                                    >
                                        <i className="material-icons">&#xE872;</i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                {/* Pagination */}
                <div className="clearfix">
                    <div className="hint-text">
                        Affichage de <b>{((currentPage - 1) * usersPerPage) + 1}</b> à <b>{Math.min(currentPage * usersPerPage, totalUsers)}</b> sur <b>{totalUsers}</b> utilisateurs
                    </div>
                    <ul className="pagination">
                        <li className={`page-item ${!previousPage ? 'disabled' : ''}`}>
                            <a href="#" className="page-link" onClick={(e) => { 
                                e.preventDefault(); 
                                if (previousPage) {
                                    setCurrentPage(currentPage - 1);
                                }
                            }}>
                                <i className="material-icons">&#xE314;</i>
                            </a>
                        </li>
                        {[...Array(totalPages)].map((_, index) => (
                            <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                <a href="#" className="page-link" onClick={(e) => { 
                                    e.preventDefault(); 
                                    setCurrentPage(index + 1);
                                }}>
                                    {index + 1}
                                </a>
                            </li>
                        ))}
                        <li className={`page-item ${!nextPage ? 'disabled' : ''}`}>
                            <a href="#" className="page-link" onClick={(e) => { 
                                e.preventDefault(); 
                                if (nextPage) {
                                    setCurrentPage(currentPage + 1);
                                }
                            }}>
                                <i className="material-icons">&#xE315;</i>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Add User Modal */}
            <div className="modal fade" id="addUserModal" tabIndex={-1}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Ajouter un utilisateur</h4>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Nom d'utilisateur</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="username"
                                    value={newUser.username}
                                    onChange={(e) => handleUserChange('username', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                    <label>Rôle</label>
                                    <select
                                       name='role'
                                        className="form-control"
                                        value={newUser.role} 
                                        onChange={(e) => handleUserChange('role', e.target.value)}
                                        required>
                                        <option value={UserRole.GESTIONNAIRE}>Gestionnaire</option>
                                        <option value={UserRole.RESPONSABLE}>Responsable</option>
                                    </select>
                                </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    name="email"
                                    value={newUser.email} 
                                    onChange={(e) => handleUserChange('email', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Mot de passe</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    name="password"
                                    value={newUser.password}
                                    onChange={(e) => handleUserChange('password', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Prénom</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="first_name"
                                    value={newUser.first_name}
                                    onChange={(e) => handleUserChange('first_name', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Nom</label>
                                <input      
                                    type="text"
                                    name="last_name"
                                    className="form-control"
                                    value={newUser.last_name}
                                    onChange={(e) => handleUserChange('last_name', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Téléphone</label>
                                <input
                                    type="text"
                                    name="telephone"
                                    className="form-control"
                                    value={newUser.telephone}
                                    onChange={(e) => handleUserChange('telephone', e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-bs-dismiss="modal">Annuler</button>
                            <button type="button" className="btn btn-success" onClick={handleAddUser}>Enregistrer</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit User Modal */}
            {editingUser && (
                <div className="modal fade" id="editUserModal" tabIndex={-1}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Modifier l'utilisateur</h4>
                                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Nom d'utilisateur</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="username"
                                        value={editingUser.username}
                                        onChange={(e) => handleUserChange('username', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Rôle</label>
                                    <select
                                       name='role'
                                        className="form-control"
                                        value={editingUser.role} 
                                        onChange={(e) => handleUserChange('role', e.target.value)}
                                        required>
                                        <option value={UserRole.GESTIONNAIRE}>Gestionnaire</option>
                                        <option value={UserRole.RESPONSABLE}>Responsable</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        value={editingUser.email}
                                        onChange={(e) => handleUserChange('email', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Mot de passe</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        name="password"
                                        value={editingUser.password}
                                        onChange={(e) => handleUserChange('password', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Prénom</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="first_name"
                                        value={editingUser.first_name}
                                        onChange={(e) => handleUserChange('first_name', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Nom</label>
                                    <input
                                        type="text"
                                        name="last_name"
                                        className="form-control"
                                        value={editingUser.last_name}
                                        onChange={(e) => handleUserChange('last_name', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Téléphone</label>
                                    <input
                                        type="text"
                                        name="telephone"
                                        className="form-control"
                                        value={editingUser.telephone}
                                        onChange={(e) => handleUserChange('telephone', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default" data-bs-dismiss="modal">Annuler</button>
                                <button type="button" className="btn btn-info" onClick={handleEditUser}>Enregistrer</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Multiple Users Modal */}
            <div className="modal fade" id="deleteMultipleUserModal" tabIndex={-1}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Supprimer les utilisateurs</h4>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body">
                            <p>Êtes-vous sûr de vouloir supprimer les utilisateurs sélectionnés ?</p>
                            <p className="text-warning"><small>Cette action est irréversible.</small></p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-bs-dismiss="modal">Annuler</button>
                            <button type="button" className="btn btn-danger" onClick={handleDeleteSelected}>Supprimer</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GestionUtilisateur;
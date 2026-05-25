const express = require('express');
const router = express.Router();
const { autenticar } = require('../middleware/auth');
const pushNotificationService = require('../services/pushNotificationService');
const { Orden } = require('../models');  // ✅ AGREGAR ESTA LÍNEA
// Registrar token FCM
router.post('/registrar-token', autenticar, async (req, res) => {
    try {
        const { token, dispositivo, plataforma } = req.body;
        await pushNotificationService.registrarToken(
            req.usuario.id,
            token,
            dispositivo || req.headers['user-agent'],
            plataforma || 'web'
        );
        res.json({ success: true, message: 'Token registrado correctamente' });
    } catch (error) {
        console.error('Error registrando token:', error);
        res.status(500).json({ error: 'Error registrando token' });
    }
});

// Eliminar token FCM (logout)
router.delete('/eliminar-token', autenticar, async (req, res) => {
    try {
        const { token } = req.body;
        await pushNotificationService.eliminarToken(token);
        res.json({ success: true, message: 'Token eliminado' });
    } catch (error) {
        console.error('Error eliminando token:', error);
        res.status(500).json({ error: 'Error eliminando token' });
    }
});

// Enviar prueba de notificación push
router.post('/test', autenticar, async (req, res) => {
    try {
        await pushNotificationService.enviarNotificacionAUsuario(
            req.usuario.id,
            '🔔 Notificación de prueba',
            'Esta es una notificación push desde el servidor',
            { url: '/dashboard' }
        );
        res.json({ success: true, message: 'Notificación de prueba enviada' });
    } catch (error) {
        console.error('Error enviando notificación de prueba:', error);
        res.status(500).json({ error: 'Error enviando notificación' });
    }
});


// Programar notificación push para una orden
router.post('/programar', autenticar, async (req, res) => {
    try {
        const { ordenId, minutosAntes } = req.body;
        const orden = await Orden.findByPk(ordenId);
        
        if (!orden) {
            return res.status(404).json({ error: 'Orden no encontrada' });
        }
        
        await pushNotificationService.programarNotificacionPush(orden, minutosAntes);
        res.json({ success: true, message: `Notificación programada para ${minutosAntes} min antes` });
    } catch (error) {
        console.error('Error programando notificación:', error);
        res.status(500).json({ error: 'Error programando notificación' });
    }
});






module.exports = router;